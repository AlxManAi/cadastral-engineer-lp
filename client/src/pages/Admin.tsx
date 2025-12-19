import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { useContent, useUpdateContent, useInquiries } from "@/hooks/use-content";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, LayoutDashboard, Users, FileText, Settings, LogOut } from "lucide-react";
import { Link } from "wouter";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

// Mock auth state for simplicity as per requirements
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
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
            />
            <Button type="submit" className="w-full">Войти</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Reusable editor component for JSON fields
function JsonEditor({ label, dataKey, defaultData }: { label: string, dataKey: string, defaultData: any }) {
  const { mutate, isPending } = useUpdateContent();
  const { toast } = useToast();
  const [jsonStr, setJsonStr] = useState(JSON.stringify(defaultData, null, 2));

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonStr);
      mutate({ key: dataKey, value: parsed }, {
        onSuccess: () => toast({ title: "Сохранено!", description: `Секция ${label} обновлена.` }),
        onError: () => toast({ title: "Ошибка сохранения", variant: "destructive" })
      });
    } catch (e) {
      toast({ title: "Ошибка JSON", description: "Проверьте синтаксис", variant: "destructive" });
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {label}
          <Button onClick={handleSave} disabled={isPending} size="sm">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" /> Сохранить
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea 
          value={jsonStr} 
          onChange={(e) => setJsonStr(e.target.value)} 
          className="font-mono text-sm h-[300px]" 
        />
        <p className="text-xs text-muted-foreground mt-2">
          Редактируйте JSON аккуратно. Сохраняйте структуру ключей.
        </p>
      </CardContent>
    </Card>
  );
}

function InquiriesTable() {
  const { data: inquiries, isLoading } = useInquiries();

  if (isLoading) return <div>Загрузка заявок...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Заявки с сайта</CardTitle>
        <CardDescription>Список клиентов, оставивших контакты.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b">
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
                <tr key={inq.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">#{inq.id}</td>
                  <td className="px-4 py-3">{inq.createdAt ? format(new Date(inq.createdAt), "dd MMM yyyy HH:mm", { locale: ru }) : "-"}</td>
                  <td className="px-4 py-3 font-medium">{inq.name}</td>
                  <td className="px-4 py-3">{inq.phone}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                      {inq.status}
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
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  }

  // Safety fallback if content hasn't loaded yet
  const safeContent = content || {};

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-xl flex items-center gap-2">
            <LayoutDashboard className="text-primary" />
            Админ-панель
          </div>
          <div className="flex items-center gap-4">
             <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
               Перейти на сайт
             </Link>
             <Button variant="ghost" size="icon" onClick={() => setIsAuth(false)}>
               <LogOut className="w-5 h-5" />
             </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="inquiries" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[600px] bg-white border shadow-sm">
            <TabsTrigger value="inquiries">Заявки</TabsTrigger>
            <TabsTrigger value="general">Главная</TabsTrigger>
            <TabsTrigger value="services">Услуги</TabsTrigger>
            <TabsTrigger value="testimonials">Отзывы</TabsTrigger>
          </TabsList>

          <TabsContent value="inquiries">
            <InquiriesTable />
          </TabsContent>

          <TabsContent value="general">
            <div className="grid lg:grid-cols-2 gap-6">
              <JsonEditor 
                label="Герой (Hero Section)" 
                dataKey="hero" 
                defaultData={safeContent.hero || { title: "", subtitle: "", ctaText: "" }} 
              />
              <JsonEditor 
                label="Статистика" 
                dataKey="stats" 
                defaultData={safeContent.stats || {}} 
              />
              <JsonEditor 
                label="Контакты" 
                dataKey="contacts" 
                defaultData={safeContent.contacts || {}} 
              />
            </div>
          </TabsContent>

          <TabsContent value="services">
            <JsonEditor 
               label="Список услуг" 
               dataKey="services" 
               defaultData={safeContent.services || []} 
            />
          </TabsContent>

          <TabsContent value="testimonials">
            <JsonEditor 
               label="Отзывы клиентов" 
               dataKey="testimonials" 
               defaultData={safeContent.testimonials || []} 
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
