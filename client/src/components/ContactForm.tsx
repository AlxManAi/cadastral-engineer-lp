import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateInquiry } from "@/hooks/use-content";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send } from "lucide-react";
import { motion } from "framer-motion";

const formSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  phone: z.string().min(10, "Введите корректный номер телефона"),
});

export function ContactForm() {
  const { toast } = useToast();
  const { mutate, isPending } = useCreateInquiry();
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values, {
      onSuccess: () => {
        setIsSuccess(true);
        form.reset();
        toast({
          title: "Заявка отправлена!",
          description: "Мы свяжемся с вами в ближайшее время.",
          variant: "default",
        });
      },
      onError: () => {
        toast({
          title: "Ошибка",
          description: "Не удалось отправить заявку. Попробуйте позже.",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-primary/10">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Бесплатная консультация</h3>
        <p className="text-muted-foreground mt-2">Оставьте номер, и мы перезвоним в течение 15 минут</p>
      </div>

      {isSuccess ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-green-50 p-6 rounded-xl text-center border border-green-200"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-green-600" />
          </div>
          <h4 className="text-xl font-bold text-green-800 mb-2">Спасибо!</h4>
          <p className="text-green-700">Ваша заявка принята. Ожидайте звонка.</p>
          <Button 
            variant="outline" 
            className="mt-6 border-green-600 text-green-700 hover:bg-green-100"
            onClick={() => setIsSuccess(false)}
          >
            Отправить еще одну
          </Button>
        </motion.div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Ваше имя</FormLabel>
                  <FormControl>
                    <Input placeholder="Иван Иванов" {...field} className="h-12 bg-gray-50 border-gray-200 focus:ring-primary/20" />
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
                  <FormLabel className="text-gray-700">Номер телефона</FormLabel>
                  <FormControl>
                    <Input placeholder="+7 (999) 000-00-00" {...field} className="h-12 bg-gray-50 border-gray-200 focus:ring-primary/20" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-semibold bg-accent hover:bg-accent/90 shadow-lg shadow-accent/25"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Отправка...
                </>
              ) : (
                "Получить консультацию"
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-4">
              Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных
            </p>
          </form>
        </Form>
      )}
    </div>
  );
}
