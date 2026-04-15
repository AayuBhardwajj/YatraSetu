'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Phone, MapPin, Camera, ChevronRight, ChevronLeft, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { useAuthStore } from '@/store/useAuthStore'
import { createClient } from '@/lib/supabase/client'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { cn } from '@/lib/utils'

const schema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid mobile number').optional().or(z.literal('')),
  city: z.string().min(2, 'City is required'),
})

type FormValues = z.infer<typeof schema>

const STEPS = ['Your Name', 'Contact', 'Location & Photo']

export default function UserOnboardingPage() {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const { user, updateUserProfile } = useAuthStore()
  const supabase = createClient()

  const { register, handleSubmit, trigger, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  const next = async () => {
    const fieldMap: Record<number, (keyof FormValues)[]> = {
      0: ['full_name'],
      1: ['phone'],
    }
    const valid = await trigger(fieldMap[step])
    if (!valid) return
    setDirection(1)
    setStep(s => s + 1)
  }

  const back = () => {
    setDirection(-1)
    setStep(s => s - 1)
  }

  const onSubmit = async (data: FormValues) => {
    setLoading(true)
    try {
      if (!user) throw new Error('Not authenticated')

      let avatar_url = ''

      if (photo) {
        const res = await fetch('/api/cloudinary/sign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ docType: 'avatar' }),
        })
        const signData = await res.json()
        const uploaded = await uploadToCloudinary(photo, signData)
        avatar_url = uploaded.secure_url
      }

      const { error } = await supabase
        .from('user_profiles')
        .update({
          full_name: data.full_name,
          phone: data.phone || null,
          city: data.city,
          avatar_url: avatar_url || undefined,
          is_profile_complete: true
        })
        .eq('user_id', user.id)

      if (error) throw error

      // Optimistic update so sidebar/header reflect name instantly
      updateUserProfile({ full_name: data.full_name, is_profile_complete: true })
      router.push('/home')
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[40px] shadow-2xl overflow-hidden"
      >
        <div className="p-8 pb-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex gap-2">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={cn('h-1.5 w-10 rounded-full transition-all duration-300', step > i ? 'bg-primary' : step === i ? 'bg-primary/60' : 'bg-muted')}
                />
              ))}
            </div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
              {step + 1} / {STEPS.length}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-text-primary">Complete Your Profile</h2>
          <p className="text-sm text-text-muted mt-1">{STEPS[step]}</p>
        </div>

        <div className="px-8 py-4 min-h-[260px] relative">
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
              {step === 0 && (
                <div className="relative">
                  <User className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" />
                  <Input
                    {...register('full_name')}
                    placeholder="Your full name"
                    className={cn('h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold', errors.full_name && 'bg-red-50')}
                  />
                  {errors.full_name && (
                    <p className="text-red-500 text-[10px] font-bold mt-1.5 ml-2">{errors.full_name.message}</p>
                  )}
                </div>
              )}

              {step === 1 && (
                <div className="relative">
                  <Phone className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" />
                  <Input
                    {...register('phone')}
                    placeholder="Phone number (optional)"
                    className="h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-[10px] font-bold mt-1.5 ml-2">{errors.phone.message}</p>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div className="flex justify-center">
                    <label className="relative cursor-pointer group">
                      <div className="w-24 h-24 rounded-[28px] bg-muted/40 border-2 border-dashed border-border flex flex-col items-center justify-center overflow-hidden group-hover:bg-muted/60 transition-all">
                        {photoPreview
                          ? <img src={photoPreview} className="w-full h-full object-cover" alt="preview" />
                          : <><Camera className="w-6 h-6 text-text-muted" /><span className="text-[9px] font-bold text-text-muted mt-1 uppercase">Photo</span></>
                        }
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const f = e.target.files?.[0]
                          if (f) { setPhoto(f); setPhotoPreview(URL.createObjectURL(f)) }
                        }}
                      />
                    </label>
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-[1.1rem] w-5 h-5 text-text-muted" />
                    <Input
                      {...register('city')}
                      placeholder="Your city"
                      className={cn('h-14 pl-12 bg-muted/40 border-none rounded-2xl font-semibold', errors.city && 'bg-red-50')}
                    />
                    {errors.city && (
                      <p className="text-red-500 text-[10px] font-bold mt-1.5 ml-2">{errors.city.message}</p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="p-8 pt-4 flex gap-3">
          {step > 0 && (
            <Button variant="ghost" onClick={back} className="h-14 flex-1 rounded-2xl font-bold bg-muted/20">
              <ChevronLeft className="mr-1 w-4 h-4" /> Back
            </Button>
          )}
          {step < STEPS.length - 1 ? (
            <Button onClick={next} className="h-14 flex-[2] bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/25">
              Continue <ChevronRight className="ml-1 w-4 h-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit(onSubmit)}
              disabled={loading}
              className="h-14 flex-[2] bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/25"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle2 className="mr-2 w-5 h-5" /> Finish</>}
            </Button>
          )}
        </div>
        <div className="h-1.5 bg-gradient-to-r from-primary via-[#9D80FF] to-primary/40" />
      </motion.div>
    </div>
  )
}
