import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useContent, useUpdateContent, useInquiries } from "@/hooks/use-content";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, LayoutDashboard, Plus, Trash2, LogOut, Eye } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pass, setPass] = useState("");
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === "admin123") {
      onLogin();
    } else {
      toast({ title: "Неверный пароль", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Вход в админ-панель</CardTitle>
          <CardDescription>Введите пароль администратора</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input 
              type="password" 
              placeholder="Пароль" 
              value={pass} 
              onChange={(e) => setPass(e.target.value)}
              data-testid="input-admin-password"
            />
            <Button type="submit" className="w-full" data-testid="button-admin-login">Войти</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function HeroEditor({ data }: { data: any }) {
  const { mutate, isPending } = useUpdateContent();
  const { toast } = useToast();
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    ctaText: "",
  });

  useEffect(() => {
    if (data) {
      setForm({
        title: data.title || "",
        subtitle: data.subtitle || "",
        ctaText: data.ctaText || "",
      });
    }
  }, [data]);

  const handleSave = () => {
    mutate({ key: "hero", value: form }, {
      onSuccess: () => toast({ title: "Сохранено!" }),
      onError: () => toast({ title: "Ошибка", variant: "destructive" })
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Первый экран (Hero)
          <Button onClick={handleSave} disabled={isPending} size="sm" data-testid="button-save-hero">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" /> Сохранить
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Заголовок</Label>
          <Input 
            value={form.title} 
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            data-testid="input-hero-title"
          />
        </div>
        <div>
          <Label>Подзаголовок</Label>
          <Textarea 
            value={form.subtitle} 
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            data-testid="input-hero-subtitle"
          />
        </div>
        <div>
          <Label>Текст кнопки</Label>
          <Input 
            value={form.ctaText} 
            onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
            data-testid="input-hero-cta"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function ContactsEditor({ data }: { data: any }) {
  const { mutate, isPending } = useUpdateContent();
  const { toast } = useToast();
  const [form, setForm] = useState({
    phone1: "",
    phone2: "",
    email: "",
    whatsapp: "",
  });

  useEffect(() => {
    if (data) {
      setForm({
        phone1: data.phone1 || "",
        phone2: data.phone2 || "",
        email: data.email || "",
        whatsapp: data.whatsapp || "",
      });
    }
  }, [data]);

  const handleSave = () => {
    mutate({ key: "contact", value: form }, {
      onSuccess: () => toast({ title: "Контакты сохранены!" }),
      onError: () => toast({ title: "Ошибка", variant: "destructive" })
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Контакты
          <Button onClick={handleSave} disabled={isPending} size="sm" data-testid="button-save-contacts">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" /> Сохранить
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Телефон 1</Label>
            <Input 
              value={form.phone1} 
              onChange={(e) => setForm({ ...form, phone1: e.target.value })}
              data-testid="input-contact-phone1"
            />
          </div>
          <div>
            <Label>Телефон 2</Label>
            <Input 
              value={form.phone2} 
              onChange={(e) => setForm({ ...form, phone2: e.target.value })}
              data-testid="input-contact-phone2"
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Email</Label>
            <Input 
              value={form.email} 
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              data-testid="input-contact-email"
            />
          </div>
          <div>
            <Label>WhatsApp (только цифры)</Label>
            <Input 
              value={form.whatsapp} 
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              data-testid="input-contact-whatsapp"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ProcessEditor({ data }: { data: any }) {
  const { mutate, isPending } = useUpdateContent();
  const { toast } = useToast();
  const defaultSteps = [
    { number: "01", title: "Вы оставляете заявку", text: "Звоните или заполняете форму" },
    { number: "02", title: "Мы выезжаем и делаем замеры", text: "Наш инженер приедет на объект" },
    { number: "03", title: "Вы получаете документы", text: "Мы подготовим план и подадим в Росреестр" }
  ];
  const [steps, setSteps] = useState(defaultSteps);

  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      setSteps(data);
    }
  }, [data]);

  const handleSave = () => {
    mutate({ key: "process", value: steps }, {
      onSuccess: () => toast({ title: "Процесс сохранён!" }),
      onError: () => toast({ title: "Ошибка", variant: "destructive" })
    });
  };

  const updateStep = (index: number, field: string, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Как всё пройдёт (Процесс)
          <Button onClick={handleSave} disabled={isPending} size="sm" data-testid="button-save-process">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" /> Сохранить
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {steps.map((step: any, i: number) => (
          <div key={i} className="p-4 border rounded-lg space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                {step.number}
              </span>
              <span className="font-semibold">Шаг {i + 1}</span>
            </div>
            <div>
              <Label>Заголовок шага</Label>
              <Input 
                value={step.title} 
                onChange={(e) => updateStep(i, "title", e.target.value)}
                data-testid={`input-process-title-${i}`}
              />
            </div>
            <div>
              <Label>Описание</Label>
              <Textarea 
                value={step.text} 
                onChange={(e) => updateStep(i, "text", e.target.value)}
                data-testid={`input-process-text-${i}`}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ServicesEditor({ data }: { data: any[] }) {
  const { mutate, isPending } = useUpdateContent();
  const { toast } = useToast();
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setServices(data);
    }
  }, [data]);

  const handleSave = () => {
    mutate({ key: "services", value: services }, {
      onSuccess: () => toast({ title: "Услуги сохранены!" }),
      onError: () => toast({ title: "Ошибка", variant: "destructive" })
    });
  };

  const addService = () => {
    setServices([...services, { 
      id: Date.now().toString(), 
      title: "Новая услуга", 
      description: "Описание услуги", 
      price: "от 10 000 ₽" 
    }]);
  };

  const removeService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  const updateService = (id: string, field: string, value: string) => {
    setServices(services.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center flex-wrap gap-2">
          Что мы для вас сделаем (Услуги)
          <div className="flex gap-2">
            <Button onClick={addService} variant="outline" size="sm" data-testid="button-add-service">
              <Plus className="mr-2 h-4 w-4" /> Добавить
            </Button>
            <Button onClick={handleSave} disabled={isPending} size="sm" data-testid="button-save-services">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" /> Сохранить
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {services.map((service, i) => (
          <div key={service.id} className="p-4 border rounded-lg space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-sm text-muted-foreground">Услуга #{i + 1}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => removeService(service.id)}
                data-testid={`button-delete-service-${service.id}`}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Название</Label>
                <Input 
                  value={service.title} 
                  onChange={(e) => updateService(service.id, "title", e.target.value)}
                  data-testid={`input-service-title-${service.id}`}
                />
              </div>
              <div>
                <Label>Цена</Label>
                <Input 
                  value={service.price || ""} 
                  onChange={(e) => updateService(service.id, "price", e.target.value)}
                  data-testid={`input-service-price-${service.id}`}
                />
              </div>
            </div>
            <div>
              <Label>Описание</Label>
              <Textarea 
                value={service.description} 
                onChange={(e) => updateService(service.id, "description", e.target.value)}
                data-testid={`input-service-description-${service.id}`}
              />
            </div>
          </div>
        ))}
        {services.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Нет услуг. Нажмите "Добавить" чтобы создать.</p>
        )}
      </CardContent>
    </Card>
  );
}

function TestimonialsEditor({ data }: { data: any[] }) {
  const { mutate, isPending } = useUpdateContent();
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setTestimonials(data);
    }
  }, [data]);

  const handleSave = () => {
    mutate({ key: "testimonials", value: testimonials }, {
      onSuccess: () => toast({ title: "Отзывы сохранены!" }),
      onError: () => toast({ title: "Ошибка", variant: "destructive" })
    });
  };

  const addTestimonial = () => {
    setTestimonials([...testimonials, { 
      id: Date.now().toString(), 
      name: "Имя клиента", 
      text: "Текст отзыва",
      role: "",
      rating: 5 
    }]);
  };

  const removeTestimonial = (id: string) => {
    setTestimonials(testimonials.filter(t => t.id !== id));
  };

  const updateTestimonial = (id: string, field: string, value: any) => {
    setTestimonials(testimonials.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center flex-wrap gap-2">
          Что говорят о нас клиенты (Отзывы)
          <div className="flex gap-2">
            <Button onClick={addTestimonial} variant="outline" size="sm" data-testid="button-add-testimonial">
              <Plus className="mr-2 h-4 w-4" /> Добавить
            </Button>
            <Button onClick={handleSave} disabled={isPending} size="sm" data-testid="button-save-testimonials">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" /> Сохранить
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {testimonials.map((review, i) => (
          <div key={review.id} className="p-4 border rounded-lg space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-sm text-muted-foreground">Отзыв #{i + 1}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => removeTestimonial(review.id)}
                data-testid={`button-delete-testimonial-${review.id}`}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Имя</Label>
                <Input 
                  value={review.name} 
                  onChange={(e) => updateTestimonial(review.id, "name", e.target.value)}
                  data-testid={`input-testimonial-name-${review.id}`}
                />
              </div>
              <div>
                <Label>Кто человек (должность/компания)</Label>
                <Input 
                  value={review.role || ""} 
                  onChange={(e) => updateTestimonial(review.id, "role", e.target.value)}
                  placeholder="Владелец участка"
                  data-testid={`input-testimonial-role-${review.id}`}
                />
              </div>
            </div>
            <div>
              <Label>Текст отзыва</Label>
              <Textarea 
                value={review.text} 
                onChange={(e) => updateTestimonial(review.id, "text", e.target.value)}
                data-testid={`input-testimonial-text-${review.id}`}
              />
            </div>
          </div>
        ))}
        {testimonials.length === 0 && (
          <p className="text-center text-muted-foreground py-8">Нет отзывов. Нажмите "Добавить" чтобы создать.</p>
        )}
      </CardContent>
    </Card>
  );
}

function InquiriesTable() {
  const { data: inquiries, isLoading } = useInquiries();

  if (isLoading) return <div className="p-8 text-center">Загрузка заявок...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Заявки с сайта</CardTitle>
        <CardDescription>Список клиентов, оставивших контакты через форму.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground font-medium border-b">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Дата</th>
                <th className="px-4 py-3">Имя</th>
                <th className="px-4 py-3">Телефон</th>
                <th className="px-4 py-3">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {inquiries?.map((inq) => (
                <tr key={inq.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3 text-muted-foreground">#{inq.id}</td>
                  <td className="px-4 py-3">{inq.createdAt ? format(new Date(inq.createdAt), "dd MMM yyyy HH:mm", { locale: ru }) : "-"}</td>
                  <td className="px-4 py-3 font-medium">{inq.name}</td>
                  <td className="px-4 py-3">
                    <a href={`tel:${inq.phone}`} className="text-primary hover:underline">{inq.phone}</a>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold dark:bg-blue-900 dark:text-blue-300">
                      {inq.status === "new" ? "Новая" : inq.status === "contacted" ? "Связались" : inq.status}
                    </span>
                  </td>
                </tr>
              ))}
              {(!inquiries || inquiries.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Нет заявок</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Admin() {
  const [isAuth, setIsAuth] = useState(false);
  const { data: content, isLoading } = useContent();

  if (!isAuth) return <LoginScreen onLogin={() => setIsAuth(true)} />;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }

  const safeContent = content || {};

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="font-bold text-xl flex items-center gap-2">
            <LayoutDashboard className="text-primary" />
            Админ-панель
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
              <Eye className="w-4 h-4" /> Сайт
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setIsAuth(false)} data-testid="button-admin-logout">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="inquiries" className="space-y-6">
          <TabsList className="flex flex-wrap h-auto gap-1 bg-background border shadow-sm p-1">
            <TabsTrigger value="inquiries" data-testid="tab-inquiries">Заявки</TabsTrigger>
            <TabsTrigger value="hero" data-testid="tab-hero">Главная</TabsTrigger>
            <TabsTrigger value="services" data-testid="tab-services">Услуги</TabsTrigger>
            <TabsTrigger value="process" data-testid="tab-process">Процесс</TabsTrigger>
            <TabsTrigger value="testimonials" data-testid="tab-testimonials">Отзывы</TabsTrigger>
            <TabsTrigger value="contacts" data-testid="tab-contacts">Контакты</TabsTrigger>
          </TabsList>

          <TabsContent value="inquiries">
            <InquiriesTable />
          </TabsContent>

          <TabsContent value="hero">
            <HeroEditor data={safeContent.hero} />
          </TabsContent>

          <TabsContent value="services">
            <ServicesEditor data={safeContent.services || []} />
          </TabsContent>

          <TabsContent value="process">
            <ProcessEditor data={safeContent.process} />
          </TabsContent>

          <TabsContent value="testimonials">
            <TestimonialsEditor data={safeContent.testimonials || []} />
          </TabsContent>

          <TabsContent value="contacts">
            <ContactsEditor data={safeContent.contact} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
