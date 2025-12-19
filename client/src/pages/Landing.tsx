import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import { Link } from "wouter";
import { 
  MapPin, Phone, Mail, ChevronRight, CheckCircle, 
  Ruler, FileText, Home, Shield, Award, Users,
  Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Sheet, SheetContent, SheetTrigger 
} from "@/components/ui/sheet";
import { useContent } from "@/hooks/use-content";
import { SectionHeading } from "@/components/SectionHeading";
import { ContactForm } from "@/components/ContactForm";
import { Skeleton } from "@/components/ui/skeleton";

// --- Types for Frontend Consumption ---
// (Normally these would be inferred or shared, but for display logic we define shape here)
interface ContentData {
  hero: { title: string; subtitle: string; ctaText: string };
  stats: { years: string; projects: string; landArea: string; satisfaction: string };
  contacts: { phone1: string; phone2: string; email: string; whatsapp: string };
  services: Array<{ id: string; title: string; description: string; price?: string }>;
  testimonials: Array<{ id: string; name: string; text: string; rating?: number }>;
}

// --- Default Data for Fallback ---
const DEFAULT_CONTENT: ContentData = {
  hero: {
    title: "Кадастровые работы любой сложности",
    subtitle: "Профессиональное оформление недвижимости, межевание и геодезия с гарантией результата.",
    ctaText: "Бесплатная консультация"
  },
  stats: {
    years: "12",
    projects: "3000+",
    landArea: "5000+",
    satisfaction: "99%"
  },
  contacts: {
    phone1: "+7 (999) 123-45-67",
    phone2: "+7 (999) 765-43-21",
    email: "info@kadastr.ru",
    whatsapp: "https://wa.me/79991234567"
  },
  services: [
    { id: "1", title: "Межевание земельных участков", description: "Уточнение границ, раздел, объединение участков.", price: "от 5 000 ₽" },
    { id: "2", title: "Технический план", description: "Для постановки дома, бани или гаража на кадастровый учет.", price: "от 6 000 ₽" },
    { id: "3", title: "Акт обследования", description: "Для снятия объекта недвижимости с учета при сносе.", price: "от 3 000 ₽" },
    { id: "4", title: "Вынос границ в натуру", description: "Определение точных границ участка на местности колышками.", price: "от 1 000 ₽/точка" },
    { id: "5", title: "Топографическая съемка", description: "Для газификации, разрешения на строительство и проектирования.", price: "от 8 000 ₽" },
    { id: "6", title: "Юридическое сопровождение", description: "Помощь в оформлении прав собственности и решении споров.", price: "Индивидуально" },
  ],
  testimonials: [
    { id: "1", name: "Алексей Смирнов", text: "Отличная работа! Сделали межевание за 3 дня. Очень грамотные специалисты, все объяснили и показали.", rating: 5 },
    { id: "2", name: "Елена Петрова", text: "Обращалась за техпланом на дом. Документы подготовили быстро, в МФЦ приняли без вопросов. Рекомендую!", rating: 5 },
    { id: "3", name: "ООО 'СтройИнвест'", text: "Сотрудничаем уже 2 года по всем нашим объектам. Надежный партнер, всегда соблюдают сроки.", rating: 5 },
  ]
};

export default function Landing() {
  const { data: serverData, isLoading } = useContent();
  
  // Merge server data with defaults to ensure we always have content
  const content: ContentData = {
    ...DEFAULT_CONTENT,
    ...(serverData || {})
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка сайта...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
      
      {/* --- HEADER --- */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white">
              <MapPin size={24} />
            </div>
            <div>
              <h1 className="font-bold text-xl leading-none text-primary">ГеоВектор</h1>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Кадастровые работы</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-gray-600">
            {['О нас', 'Услуги', 'Этапы', 'Отзывы', 'Контакты'].map((item) => (
              <ScrollLink 
                key={item}
                to={item === 'О нас' ? 'about' : item === 'Услуги' ? 'services' : item === 'Этапы' ? 'process' : item === 'Отзывы' ? 'testimonials' : 'contact'}
                smooth={true}
                offset={-100}
                className="cursor-pointer hover:text-primary transition-colors"
              >
                {item}
              </ScrollLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a href={`tel:${content.contacts.phone1}`} className="text-right">
              <div className="font-bold text-gray-900">{content.contacts.phone1}</div>
              <div className="text-xs text-accent">Заказать звонок</div>
            </a>
            <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 rounded-full px-6">
              <ScrollLink to="contact" smooth={true} offset={-100}>Оставить заявку</ScrollLink>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger className="md:hidden p-2">
              <Menu className="w-6 h-6 text-gray-700" />
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col gap-6 mt-10 text-lg font-medium">
                {['О нас', 'Услуги', 'Этапы', 'Отзывы', 'Контакты'].map((item) => (
                  <ScrollLink 
                    key={item}
                    to={item === 'О нас' ? 'about' : item === 'Услуги' ? 'services' : item === 'Этапы' ? 'process' : item === 'Отзывы' ? 'testimonials' : 'contact'}
                    smooth={true}
                    offset={-100}
                    className="cursor-pointer text-gray-700 hover:text-primary"
                  >
                    {item}
                  </ScrollLink>
                ))}
                <div className="mt-8 border-t pt-8">
                  <a href={`tel:${content.contacts.phone1}`} className="flex items-center gap-3 mb-4 text-gray-900 font-bold">
                    <Phone className="w-5 h-5 text-accent" />
                    {content.contacts.phone1}
                  </a>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                    Оставить заявку
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100" />
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-30" />
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 -skew-x-12 translate-x-20" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent font-medium text-sm mb-6">
                <CheckCircle className="w-4 h-4" />
                Лицензированные кадастровые инженеры
              </div>
              <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
                {content.hero.title}
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
                {content.hero.subtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-primary hover:bg-primary/90 shadow-xl shadow-primary/25">
                  <ScrollLink to="contact" smooth={true} offset={-100}>{content.hero.ctaText}</ScrollLink>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-2 border-gray-200 hover:bg-gray-50 text-gray-700">
                  <ScrollLink to="services" smooth={true} offset={-100}>Наши услуги</ScrollLink>
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="mt-12 flex items-center gap-8 text-gray-500">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium">Гарантия по договору</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-accent" />
                  <span className="text-sm font-medium">Аттестат СРО</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              {/* Image Container with decoration */}
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
                {/* Use Unsplash image for Surveyor context */}
                {/* surveyor land measuring equipment outdoors */}
                <img 
                  src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2070&auto=format&fit=crop" 
                  alt="Кадастровые работы" 
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute inset-0 border-2 border-accent/30 rounded-3xl transform -rotate-2 scale-105 z-0" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-12 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Лет опыта", value: content.stats.years },
              { label: "Проектов", value: content.stats.projects },
              { label: "Га земли", value: content.stats.landArea },
              { label: "Довольных клиентов", value: content.stats.satisfaction }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-4"
              >
                <div className="text-4xl md:text-5xl font-bold mb-2 text-accent">{stat.value}</div>
                <div className="text-primary-foreground/80 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- ABOUT / FEATURES SECTION --- */}
      <section id="about" className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4">
          <SectionHeading title="Почему выбирают нас" subtitle="Мы ценим ваше время и гарантируем юридическую чистоту всех документов." />

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Ruler, title: "Точность измерений", text: "Используем современное GPS/GLONASS оборудование для максимальной точности границ." },
              { icon: FileText, title: "Работа под ключ", text: "Сами запрашиваем сведения, проводим замеры и подаем документы в Росреестр." },
              { icon: Shield, title: "Гарантия качества", text: "Исправление ошибок за наш счет. Сопровождаем до получения выписки ЕГРН." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:border-primary/20 transition-all"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SERVICES SECTION --- */}
      <section id="services" className="py-20 lg:py-32 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeading title="Наши услуги" subtitle="Полный спектр кадастровых и геодезических работ для частных лиц и бизнеса." />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.services.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full border border-gray-100"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                  <div className="w-12 h-1 bg-accent rounded-full mb-4"></div>
                  <p className="text-muted-foreground flex-grow mb-6">{service.description}</p>
                </div>
                <div className="mt-auto flex items-center justify-between pt-6 border-t border-gray-100">
                  <span className="font-bold text-primary text-lg">{service.price}</span>
                  <ScrollLink to="contact" smooth={true} offset={-100}>
                    <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80 hover:bg-accent/10 px-0">
                      Заказать <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </ScrollLink>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PROCESS SECTION --- */}
      <section id="process" className="py-20 bg-background overflow-hidden">
        <div className="container mx-auto px-4">
          <SectionHeading title="Как мы работаем" centered />
          
          <div className="relative mt-16">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
            
            <div className="grid md:grid-cols-3 gap-8 relative z-10">
              {[
                { number: "01", title: "Заявка и договор", text: "Оставляете заявку, мы анализируем документы и заключаем договор." },
                { number: "02", title: "Выезд и замеры", text: "Геодезисты выезжают на объект и проводят необходимые измерения." },
                { number: "03", title: "Результат", text: "Готовим межевой или технический план и передаем вам готовые документы." }
              ].map((step, i) => (
                <div key={i} className="text-center bg-background md:bg-transparent p-4">
                  <div className="w-16 h-16 bg-white border-4 border-accent rounded-full flex items-center justify-center text-2xl font-bold text-gray-900 mx-auto mb-6 shadow-lg">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION --- */}
      <section id="testimonials" className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <SectionHeading title="Отзывы клиентов" subtitle="Нам доверяют более 3000 собственников недвижимости." />
          
          <div className="grid md:grid-cols-3 gap-8">
            {content.testimonials.map((review) => (
              <div key={review.id} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(review.rating || 5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{review.text}"</p>
                <div className="font-bold text-gray-900">{review.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section id="contact" className="py-20 lg:py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <SectionHeading title="Контакты" subtitle="Свяжитесь с нами любым удобным способом." centered={false} />
              
              <div className="space-y-8 mt-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 text-primary">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Телефоны</h4>
                    <a href={`tel:${content.contacts.phone1}`} className="block text-gray-600 hover:text-primary transition-colors">{content.contacts.phone1}</a>
                    <a href={`tel:${content.contacts.phone2}`} className="block text-gray-600 hover:text-primary transition-colors">{content.contacts.phone2}</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 text-primary">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Email</h4>
                    <a href={`mailto:${content.contacts.email}`} className="text-gray-600 hover:text-primary transition-colors">{content.contacts.email}</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 text-primary">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">Офис</h4>
                    <p className="text-gray-600">г. Москва, ул. Примерная, д. 10, оф. 205<br/>Пн-Пт: 09:00 - 18:00</p>
                  </div>
                </div>

                <div className="pt-8">
                   <Button variant="outline" className="gap-2 w-full md:w-auto" asChild>
                     <a href={content.contacts.whatsapp} target="_blank" rel="noopener noreferrer">
                       <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                       Написать в WhatsApp
                     </a>
                   </Button>
                </div>
              </div>
            </div>

            <div className="relative">
               <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-accent/10 rounded-[2rem] blur-xl"></div>
               <div className="relative">
                 <ContactForm />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <MapPin className="text-accent" />
                ГеоВектор
              </h2>
              <p className="max-w-sm text-gray-400">
                Профессиональные кадастровые работы. Межевание, технические планы, геодезия. Работаем по всей области.
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Навигация</h3>
              <ul className="space-y-2">
                {['О нас', 'Услуги', 'Этапы', 'Контакты'].map((item) => (
                  <li key={item}>
                    <ScrollLink 
                      to={item === 'О нас' ? 'about' : item === 'Услуги' ? 'services' : item === 'Этапы' ? 'process' : 'contact'} 
                      smooth={true} 
                      className="cursor-pointer hover:text-accent transition-colors"
                    >
                      {item}
                    </ScrollLink>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Контакты</h3>
              <ul className="space-y-2 text-sm">
                <li>{content.contacts.phone1}</li>
                <li>{content.contacts.email}</li>
                <li className="pt-2">
                  <Link href="/admin" className="text-gray-600 hover:text-gray-400 text-xs">Вход для сотрудников</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} ГеоВектор. Все права защищены.</p>
            <p>Политика конфиденциальности</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
