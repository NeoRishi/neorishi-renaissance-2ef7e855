import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ChevronLeft, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { DropdownDatePicker } from '@/components/ui/dropdown-date-picker';
import { DropdownTimePicker } from '@/components/ui/dropdown-time-picker';
import { UserDetails } from '@/data/onboardingQuestions';

const userDetailsSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email address'),
  dateOfBirth: z.date().optional(),
  timeOfBirth: z.string().optional(),
  birthPlace: z.string().optional(),
});

type UserDetailsFormData = z.infer<typeof userDetailsSchema>;

interface UserDetailsFormProps {
  onSubmit: (data: UserDetails) => void;
  onPrevious: () => void;
  isLoading?: boolean;
}

export const UserDetailsForm = ({ onSubmit, onPrevious, isLoading = false }: UserDetailsFormProps) => {
  const form = useForm<UserDetailsFormData>({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      timeOfBirth: '',
      birthPlace: '',
    }
  });

  const handleSubmit = (data: UserDetailsFormData) => {
    onSubmit({
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      dateOfBirth: data.dateOfBirth,
      timeOfBirth: data.timeOfBirth,
      birthPlace: data.birthPlace,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="border-0 shadow-elegant bg-gradient-to-br from-background/95 to-background backdrop-blur-sm">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-xl md:text-2xl font-semibold text-foreground leading-relaxed">
            Complete Your Profile
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Help us personalize your NeoRishi journey
          </p>
        </CardHeader>
        
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Required Fields */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                  Required Information
                </h3>
                
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your full name"
                          {...field}
                          className="rounded-xl border-muted/50 focus:border-primary/50 transition-colors"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="Enter your phone number"
                          {...field}
                          className="rounded-xl border-muted/50 focus:border-primary/50 transition-colors"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          {...field}
                          className="rounded-xl border-muted/50 focus:border-primary/50 transition-colors"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Optional Vedic Astrology Fields */}
              <div className="space-y-4 pt-6 border-t border-muted/30">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-medium text-foreground">
                    Vedic Astrology Personalization
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Optional: Provide birth details for personalized astrological guidance
                </p>
                
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <DropdownDatePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select your birth date"
                        />
                      </FormControl>
                      <FormDescription>
                        Used for astrological calculations and personalized guidance
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="timeOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time of Birth</FormLabel>
                      <FormControl>
                        <DropdownTimePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Select your birth time"
                        />
                      </FormControl>
                      <FormDescription>
                        Exact time helps with precise astrological readings
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="birthPlace"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Birth Place</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="City, Country (e.g., Mumbai, India)"
                          {...field}
                          className="rounded-xl border-muted/50 focus:border-primary/50 transition-colors"
                        />
                      </FormControl>
                      <FormDescription>
                        Location is needed for geographical astrological calculations
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Navigation Buttons */}
              <div className="flex justify-between items-center pt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onPrevious}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 shadow-elegant px-8"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Creating Your Journey...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Start My Journey
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};