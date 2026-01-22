"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadFormSchema, type LeadFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2 } from "lucide-react";

interface LeadFormProps {
  headline?: string;
  subhead?: string;
  privacyNote?: string;
  successMessage?: string;
  errorMessage?: string;
  nextSteps?: readonly string[];
}

export function LeadForm({
  headline = "Let's Explore If Vonga Is Right For Your Team",
  subhead,
  privacyNote,
  successMessage = "Thanks for reaching out! We'll be in touch within 24 hours.",
  errorMessage = "Something went wrong. Please try again.",
  nextSteps,
}: LeadFormProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
  });

  const onSubmit = async (data: LeadFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setIsSuccess(true);
      reset();
    } catch (error) {
      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section 
        ref={ref}
        id="contact"
        className="py-24 md:py-32 bg-gray-50"
      >
        <div className="max-w-2xl mx-auto px-6 lg:px-12">
          <motion.div
            className="bg-white rounded-lg shadow-lg p-12 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
          >
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            <h3 className="text-3xl font-bold text-navy mb-4">
              Success!
            </h3>
            <p className="text-lg text-gray-700">
              {successMessage}
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={ref}
      id="contact"
      className="py-24 md:py-32 bg-gray-50"
    >
      <div className="max-w-2xl mx-auto px-6 lg:px-12">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6">
            {headline}
          </h2>
          {subhead && (
            <p className="text-lg text-gray-700 mb-8">
              {subhead}
            </p>
          )}
          {nextSteps && nextSteps.length > 0 && (
            <div className="max-w-md mx-auto bg-muted p-6 rounded-lg">
              <h3 className="text-sm font-semibold text-navy uppercase tracking-wide mb-4">
                What Happens Next
              </h3>
              <ol className="text-left space-y-3">
                {nextSteps.map((step, index) => (
                  <li key={index} className="flex gap-3 text-sm text-gray-700">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-aqua text-white flex items-center justify-center text-xs font-semibold">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </motion.div>

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-lg shadow-lg p-8 md:p-12 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1.0] }}
        >
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name <span className="text-error">*</span>
            </label>
            <Input
              id="name"
              type="text"
              {...register("name")}
              error={!!errors.name}
              placeholder="Your name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-error">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-error">*</span>
            </label>
            <Input
              id="email"
              type="email"
              {...register("email")}
              error={!!errors.email}
              placeholder="you@team.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-error">{errors.email.message}</p>
            )}
          </div>

          {/* Organization */}
          <div>
            <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-2">
              Team / Organization <span className="text-error">*</span>
            </label>
            <Input
              id="organization"
              type="text"
              {...register("organization")}
              error={!!errors.organization}
              placeholder="Your team name"
            />
            {errors.organization && (
              <p className="mt-1 text-sm text-error">{errors.organization.message}</p>
            )}
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <Input
              id="role"
              type="text"
              {...register("role")}
              placeholder="e.g., President, CRO, Partnerships Director"
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <Textarea
              id="message"
              {...register("message")}
              placeholder="Tell us about your team and what you're looking for..."
              rows={4}
            />
          </div>

          {/* Privacy Note */}
          {privacyNote && (
            <p className="text-xs text-gray-500 text-center">
              {privacyNote}
            </p>
          )}

          {/* Submit Error */}
          {submitError && (
            <div className="p-4 bg-error/10 border border-error rounded-lg">
              <p className="text-sm text-error">{submitError}</p>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="coral"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </motion.form>
      </div>
    </section>
  );
}
