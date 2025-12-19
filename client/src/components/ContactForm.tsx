import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useCreateInquiry } from "@/hooks/use-content";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, ArrowRight } from "lucide-react";
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
    <div>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white" data-testid="text-form-title">Бесплатная консультация</h3>
        <p className="text-muted-foreground mt-2">Перезвоним в течение 5 минут</p>
      </div>

      {isSuccess ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-primary/20 p-8 rounded-xl text-center border border-primary/30"
          data-testid="form-success"
        >
          <div className="w-20 h-20 bg-primary/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <h4 className="text-2xl font-bold text-white mb-2">Спасибо за заявку!</h4>
          <p className="text-gray-300 mb-6">Наш специалист свяжется с вами в ближайшее время.</p>
          <Button 
            variant="outline" 
            className="border-primary/50 text-primary hover:bg-primary/10"
            onClick={() => setIsSuccess(false)}
            data-testid="button-new-form"
          >
            Отправить еще одну заявку
          </Button>
        </motion.div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="form-contact">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-300">Ваше имя</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Иван Иванов" 
                      {...field} 
                      className="h-14 bg-background/50 border-2 border-white/20 text-white placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 hover:border-primary/50 transition-all duration-300" 
                      data-testid="input-name"
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
                  <FormLabel className="text-gray-300">Номер телефона</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="+7 (999) 000-00-00" 
                      {...field} 
                      className="h-14 bg-background/50 border-2 border-white/20 text-white placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 hover:border-primary/50 transition-all duration-300" 
                      data-testid="input-phone"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              size="lg"
              className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-xl glow-primary"
              disabled={isPending}
              data-testid="button-submit"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Отправка...
                </>
              ) : (
                <>
                  Получить консультацию
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных
            </p>
          </form>
        </Form>
      )}
    </div>
  );
}
