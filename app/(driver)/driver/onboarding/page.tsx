'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Phone, CreditCard, Car, MapPin, Camera,
  ChevronRight, ChevronLeft, CheckCircle2, Loader2,
  Banknote, BadgeCheck, ShieldCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { cn } from '@/lib/utils'

const schema = z.object({
  full_name: z.string().min(2, 'Required'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid number'),
  aadhaar_number: z.string().regex(/^\d{12}$/, '12 digits required'),
  pan_number: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN'),
  dl_number: z.string().min(5, 'Required'),
  vehicle_type: z.enum(['auto', 'bike', 'cab']),
  make: z.string().min(1, 'Required'),
  model: z.string().min(1, 'Required'),
  plate_number: z.string().min(4, 'Required'),
  year: z.string().regex(/^\d{4}$/, 'Invalid year'),
  upi_id: z.string().min(5, 'Required'),
  bank_account: z.string().optional(),
  bank_ifsc: z.string().optional(),
  city: z.string().min(2, 'Required'),
  is_available: z.boolean().default(true),
})

type FormValues = z.infer<typeof schema>

const DOC_TYPES = ['aadhaar', 'pan', 'dl', 'rc'] as const
type DocType = typeof DOC_TYPES[number]

const STEP_LABELS = ['Basic Info', 'KYC & Docs', 'Vehicle', 'Payment', 'City & Availability']

export default function DriverOnboardingPage() {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(1)
  const [docs, setDocs] = useState<Partial<Record<DocType, File>>>({})
  const [docPreviews, setDocPreviews] = useState<Partial<Record<DocType, string>>>({})
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const { register, handleSubmit, trigger, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: { is_available: true, vehicle_type: 'cab' },
  })

  // Resume from saved onboarding_step
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      supabase
        .from('driver_profiles')
        .select('onboarding_step, full_name, phone, city, aadhaar_number, pan_number, dl_number, upi_id, bank_account, bank_ifsc, vehicle_type, is_available')
        .eq('user_id', user.id)
        .single()
        .then(({ data }) => {
          if (!data) return
          if (data.onboarding_step > 1) setStep(data.onboarding_step)
          if (data.full_name) setValue('full_name', data.full_name)
          if (data.phone) setValue('phone', data.phone)
          if (data.city) setValue('city', data.city)
          if (data.aadhaar_number) setValue('aadhaar_number', data.aadhaar_number)
          if (data.pan_number) setValue('pan_number', data.pan_number)
          if (data.dl_number) setValue('dl_number', data.dl_number)
          if (data.upi_id) setValue('upi_id', data.upi_id)
          if (data.bank_account) setValue('bank_account', data.bank_account)
          if (data.bank_ifsc) setValue('bank_ifsc', data.bank_ifsc)
          if (data.vehicle_type) setValue('vehicle_type', data.vehicle_type)
          if (typeof data.is_available === 'boolean') setValue('is_available', data.is_available)
        })
    })
  }, [])

  const persistStep = async (nextStep: number, patch: Partial<FormValues> = {}) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase
      .from('driver_profiles')
      .update({ ...patch, onboarding_step: nextStep })
      .eq('user_id', user.id)
  }

  const fieldMap: Record<number, (keyof FormValues)[]> = {
    1: ['full_name', 'phone'],
    2: ['aadhaar_number', 'pan_number', 'dl_number'],
    3: ['vehicle_type', 'make', 'model', 'plate_number', 'year'],
    4: ['upi_id'],
    5: ['city'],
  }

  const next = async () => {
    const valid = await trigger(fieldMap[step])
    if (!valid) return

    if (step === 2) {
      const missing = DOC_TYPES.filter(t => !docs[t])
      if (missing.length > 0) {
        toast({ variant: 'destructive', title: 'Missing documents', description: `Upload: ${missing.join(', ')}` })
        return
      }
    }

    const values = watch()
    const patch: Record<string, unknown> = {}
    fieldMap[step].forEach(f => { patch[f] = values[f] })
    await persistStep(step + 1, patch as Partial<FormValues>)

    setDirection(1)
    setStep(s => s + 1)
  }

  const back = () => {
    setDirection(-1)
    setStep(s => s - 1)
  }

  const handleDocChange = (type: DocType, file: File | null) => {
    if (!file) return
    setDocs(p => ({ ...p, [type]: file }))
    setDocPreviews(p => ({ ...p, [type]: URL.createObjectURL(file) }))
  }

  const onSubmit = async (data: FormValues) => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Upload documents
      for (const type of DOC_TYPES) {
        const file = docs[type]
        if (!file) continue

        const res = await fetch('/api/cloudinary/sign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ docType: type }),
        })
        const signData = await res.json()
        const uploaded = await uploadToCloudinary(file, signData)

        await supabase.from('driver_documents').upsert({
          driver_id: user.id,
          doc_type: type,
          file_url: uploaded.secure_url,
          cloudinary_id: uploaded.public_id,
        }, { onConflict: 'driver_id,doc_type' })
      }

      // Insert vehicle
      await supabase.from('vehicles').upsert({
        driver_id: user.id,
        vehicle_type: data.vehicle_type,
        make: data.make,
        model: data.model,
        plate_number: data.plate_number,
        year: parseInt(data.year),
      }, { onConflict: 'plate_number' })

      // Finalize driver profile
      const { error } = await supabase
        .from('driver_profiles')
        .update({
          full_name: data.full_name,
          phone: data.phone,
          city: data.city,
          aadhaar_number: data.aadhaar_number,
          pan_number: data.pan_number,
          dl_number: data.dl_number,
          upi_id: data.upi_id,
          bank_account: data.bank_account || null,
          bank_ifsc: data.bank_ifsc || null,
          vehicle_type: data.vehicle_type,
          is_available: data.is_available,
          onboarding_step: 5,
          is_onboarding_complete: true
        })
        .eq('user_id', user.id)

      if (error) throw error

      toast({ title: 'Application submitted!', description: 'Redirecting to your dashboard...' })
      router.push('/driver/dashboard')
    } catch (err: any) {
      toast({ variant: 'destructive', title: 'Error', description: err.message })
    } finally {
      setLoading(false)
    }
  }

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d < 0 ? 40 : -40, opacity: 0 }),
  }

  const vehicleType = watch('vehicle_type')

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden"
      >
        <div className="p-8 pb-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-1.5 flex-1 mr-4">
              {STEP_LABELS.map((_, i) => (
                <div
                  key={i}
                  className={cn('h-1.5 flex-1 rounded-full transition-all duration-300', step > i + 1 ? 'bg-primary' : step === i + 1 ? 'bg-primary/60' : 'bg-muted')}
                />
              ))}
            </div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest flex-shrink-0">
              {step} / {STEP_LABELS.length}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-text-primary">{STEP_LABELS[step - 1]}</h2>
        </div>

        <div className="px-8 py-4 min-h-[320px] relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="space-y-4"
            >
              {/* Step 1: Basic Info */}
              {step === 1 && (
                <>
                  <div className="relative">
                    <User className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" />
                    <Input {...register('full_name')} placeholder="Full name" className={cn('h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold', errors.full_name && 'bg-red-50')} />
                    {errors.full_name && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{errors.full_name.message}</p>}
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" />
                    <Input {...register('phone')} placeholder="Phone number" className={cn('h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold', errors.phone && 'bg-red-50')} />
                    {errors.phone && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{errors.phone.message}</p>}
                  </div>
                </>
              )}

              {/* Step 2: KYC */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Input {...register('aadhaar_number')} placeholder="Aadhaar (12 digits)" className={cn('h-14 bg-muted/40 border-none rounded-2xl font-semibold px-4', errors.aadhaar_number && 'bg-red-50')} />
                      {errors.aadhaar_number && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.aadhaar_number.message}</p>}
                    </div>
                    <div>
                      <Input {...register('pan_number')} placeholder="PAN Number" className={cn('h-14 bg-muted/40 border-none rounded-2xl font-semibold px-4', errors.pan_number && 'bg-red-50')} />
                      {errors.pan_number && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.pan_number.message}</p>}
                    </div>
                  </div>
                  <div>
                    <Input {...register('dl_number')} placeholder="Driving License Number" className={cn('h-14 bg-muted/40 border-none rounded-2xl font-semibold px-4', errors.dl_number && 'bg-red-50')} />
                    {errors.dl_number && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.dl_number.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {DOC_TYPES.map(type => (
                      <label key={type} className="relative flex flex-col items-center justify-center h-28 bg-muted/20 border-2 border-dashed border-border rounded-2xl cursor-pointer hover:bg-muted/40 transition-all group overflow-hidden">
                        {docPreviews[type]
                          ? <img src={docPreviews[type]} className="absolute inset-0 w-full h-full object-cover rounded-2xl" alt={type} />
                          : <><Camera className="w-5 h-5 text-text-muted" /><span className="text-[9px] font-bold text-text-muted mt-1 uppercase">{type.toUpperCase()}</span></>
                        }
                        {docPreviews[type] && (
                          <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
                            <BadgeCheck className="text-white w-7 h-7" />
                          </div>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={e => handleDocChange(type, e.target.files?.[0] ?? null)} />
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Vehicle */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    {(['bike', 'auto', 'cab'] as const).map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setValue('vehicle_type', t)}
                        className={cn('flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all', vehicleType === t ? 'bg-primary/5 border-primary text-primary' : 'bg-white border-border/60 text-text-muted')}
                      >
                        <Car className="w-5 h-5 mb-1" />
                        <span className="text-[10px] font-bold uppercase">{t}</span>
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input {...register('make')} placeholder="Make (e.g. Maruti)" className={cn('h-14 bg-muted/40 border-none rounded-2xl font-semibold px-4', errors.make && 'bg-red-50')} />
                    <Input {...register('model')} placeholder="Model (e.g. Swift)" className={cn('h-14 bg-muted/40 border-none rounded-2xl font-semibold px-4', errors.model && 'bg-red-50')} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input {...register('plate_number')} placeholder="Plate No" className={cn('h-14 bg-muted/40 border-none rounded-2xl font-semibold px-4', errors.plate_number && 'bg-red-50')} />
                    <Input {...register('year')} placeholder="Year" className={cn('h-14 bg-muted/40 border-none rounded-2xl font-semibold px-4', errors.year && 'bg-red-50')} />
                  </div>
                </div>
              )}

              {/* Step 4: Payment */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="relative">
                    <Banknote className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" />
                    <Input {...register('upi_id')} placeholder="UPI ID (e.g. name@upi)" className={cn('h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold', errors.upi_id && 'bg-red-50')} />
                    {errors.upi_id && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{errors.upi_id.message}</p>}
                  </div>
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" />
                    <Input {...register('bank_account')} placeholder="Bank Account (optional)" className="h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold" />
                  </div>
                  <Input {...register('bank_ifsc')} placeholder="IFSC Code (optional)" className="h-14 bg-muted/40 border-none rounded-2xl font-semibold px-4" />
                </div>
              )}

              {/* Step 5: City & Availability */}
              {step === 5 && (
                <div className="space-y-5">
                  <div className="relative">
                    <MapPin className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" />
                    <Input {...register('city')} placeholder="Your city" className={cn('h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold', errors.city && 'bg-red-50')} />
                    {errors.city && <p className="text-red-500 text-[10px] font-bold mt-1 ml-2">{errors.city.message}</p>}
                  </div>
                  <div className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl border-2 border-border/60">
                    <div>
                      <p className="text-sm font-bold text-text-primary">Accept rides immediately</p>
                      <p className="text-[10px] text-text-muted font-medium mt-0.5">You can toggle this anytime from your dashboard</p>
                    </div>
                    <input
                      type="checkbox"
                      {...register('is_available')}
                      className="w-10 h-6 rounded-full appearance-none bg-muted checked:bg-primary cursor-pointer transition-colors relative"
                    />
                  </div>
                  <div className="bg-primary/5 p-4 rounded-2xl border border-primary/20 flex gap-3 items-center">
                    <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0" />
                    <p className="text-[10px] font-bold text-primary/80 uppercase tracking-widest leading-relaxed">
                      All documents will be reviewed within 24–48 hours.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="p-8 pt-4 flex gap-3">
          {step > 1 && (
            <Button variant="ghost" onClick={back} className="h-14 flex-1 rounded-2xl font-bold bg-muted/20">
              <ChevronLeft className="mr-1 w-4 h-4" /> Back
            </Button>
          )}
          {step < STEP_LABELS.length ? (
            <Button onClick={next} className="h-14 flex-[2] bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/25">
              Continue <ChevronRight className="ml-1 w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              className="h-14 flex-[2] bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/25"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><BadgeCheck className="mr-2 w-5 h-5" /> Submit</>}
            </Button>
          )}
        </div>
        <div className="h-1.5 bg-gradient-to-r from-primary via-[#9D80FF] to-primary/40" />
      </motion.div>
    </div>
  )
}
