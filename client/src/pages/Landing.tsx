import { motion } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import { 
  MapPin, Phone, Mail, ChevronRight, CheckCircle, 
  Ruler, FileText, Home, Shield, Award, Users,
  Menu, Star, Clock, Target, Zap, Building, ArrowRight
} from "lucide-react";
import { SiWhatsapp } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { 
  Sheet, SheetContent, SheetTrigger 
} from "@/components/ui/sheet";
import { useContent } from "@/hooks/use-content";
import { ContactForm } from "@/components/ContactForm";

import heroImage from "@assets/stock_images/land_surveyor_with_t_5b3b0229.jpg";
import surveyorImage from "@assets/stock_images/land_surveyor_with_t_59d2feeb.jpg";
import aerialImage from "@assets/stock_images/aerial_view_city_urb_00bb8fa2.jpg";
import documentsImage from "@assets/stock_images/house_real_estate_pr_6dcb4331.jpg";
import constructionImage from "@assets/stock_images/construction_site_me_609c5c58.jpg";
import blueprintImage from "@assets/stock_images/technical_blueprint__31e57a1c.jpg";
import boundaryImage from "@assets/stock_images/land_boundary_fence__7d51d31b.jpg";
import demolitionImage from "@assets/stock_images/demolished_building__e8031f68.jpg";
import houseImage from "@assets/stock_images/cozy_family_house_co_6b77a853.jpg";
import consultantImage from "@assets/stock_images/expert_professional__df23552f.jpg";
import inspectionImage from "@assets/stock_images/building_inspection__0fcea4df.jpg";

const serviceImages = [blueprintImage, boundaryImage, demolitionImage, houseImage, inspectionImage, consultantImage];

interface ContentData {
  hero: { title: string; subtitle: string; ctaText: string };
  stats: { years: string; projects: string; landArea: string; satisfaction: string };
  contact: { phone1: string; phone2: string; email: string; whatsapp: string };
  services: Array<{ id: string; title: string; description: string; price?: string }>;
  testimonials: Array<{ id: string; name: string; text: string; rating?: number }>;
}

const DEFAULT_CONTENT: ContentData = {
  hero: {
    title: "Оформим вашу недвижимость под ключ",
    subtitle: "Кадастровые работы любой сложности с гарантией результата. Вы получаете готовые документы - мы берём на себя всё остальное.",
    ctaText: "Бесплатная консультация"
  },
  stats: {
    years: "27+",
    projects: "30,000+",
    landArea: "30,000+",
    satisfaction: "98%"
  },
  contact: {
    phone1: "+7 903 743-80-61",
    phone2: "+7 906 770-06-97",
    email: "9037438061@mail.ru",
    whatsapp: "79037438061"
  },
  services: [
    { id: "1", title: "Технический план объекта", description: "Для постановки дома, бани, гаража на кадастровый учет", price: "от 8 000 ₽" },
    { id: "2", title: "Межевой план", description: "Определение и закрепление границ земельного участка", price: "от 7 000 ₽" },
    { id: "3", title: "Акт обследования", description: "Для снятия объекта с учета при сносе", price: "от 5 000 ₽" },
    { id: "4", title: "Перевод в жилое", description: "Перевод нежилого дома в СНТ в жилой", price: "от 18 000 ₽" },
    { id: "5", title: "Экспертиза объекта", description: "Строительная и землеустроительная экспертиза", price: "от 20 000 ₽" },
    { id: "6", title: "Консультация", description: "Бесплатная консультация по земельно-имущественным вопросам", price: "Бесплатно" },
  ],
  testimonials: [
    { id: "1", name: "Алексей П.", text: "Быстро оформили дом, никаких проблем с документами. Рекомендую!", rating: 5 },
    { id: "2", name: "Марина С.", text: "Помогли с межеванием сложного участка. Спасибо за профессионализм!", rating: 5 },
    { id: "3", name: "Игорь В.", text: "Все четко, в срок и по адекватной цене. Работают на результат.", rating: 5 },
  ]
};


function getWhatsAppUrl(whatsapp: string): string {
  if (whatsapp.startsWith('http')) return whatsapp;
  return `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`;
}

export default function Landing() {
  const { data: serverData, isLoading } = useContent();
  
  const content: ContentData = {
    ...DEFAULT_CONTENT,
    ...(serverData || {})
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
      
      {/* --- HEADER --- */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-primary to-blue-400 rounded-lg flex items-center justify-center text-white shadow-lg glow-primary">
              <MapPin size={24} />
            </div>
            <div>
              <h1 className="font-bold text-xl leading-none text-white" data-testid="text-logo">Кадастр-Онлайн</h1>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Кадастровый инженер</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8 font-medium text-gray-300">
            {[
              { label: 'Услуги', to: 'services' },
              { label: 'Почему мы', to: 'why-us' },
              { label: 'Как работаем', to: 'process' },
              { label: 'Отзывы', to: 'testimonials' },
              { label: 'Контакты', to: 'contact' }
            ].map((item) => (
              <ScrollLink 
                key={item.to}
                to={item.to}
                smooth={true}
                offset={-100}
                className="cursor-pointer hover:text-primary transition-colors"
                data-testid={`link-nav-${item.to}`}
              >
                {item.label}
              </ScrollLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <a href={`tel:${content.contact.phone1.replace(/\s/g, '')}`} className="text-right group" data-testid="link-phone">
              <div className="font-bold text-white group-hover:text-primary transition-colors">{content.contact.phone1}</div>
              <div className="text-xs text-primary">Звоните сейчас</div>
            </a>
            <ScrollLink to="contact" smooth={true} offset={-100}>
              <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg glow-primary rounded-lg px-6" data-testid="button-header-cta">
                Оставить заявку
              </Button>
            </ScrollLink>
          </div>

          <Sheet>
            <SheetTrigger className="lg:hidden p-2" data-testid="button-mobile-menu">
              <Menu className="w-6 h-6 text-white" />
            </SheetTrigger>
            <SheetContent className="bg-card border-white/10">
              <nav className="flex flex-col gap-6 mt-10 text-lg font-medium">
                {['Услуги', 'Почему мы', 'Как работаем', 'Отзывы', 'Контакты'].map((item, i) => (
                  <ScrollLink 
                    key={i}
                    to={item === 'Услуги' ? 'services' : item === 'Почему мы' ? 'why-us' : item === 'Как работаем' ? 'process' : item === 'Отзывы' ? 'testimonials' : 'contact'}
                    smooth={true}
                    offset={-100}
                    className="cursor-pointer text-foreground hover:text-primary"
                  >
                    {item}
                  </ScrollLink>
                ))}
                <div className="mt-8 border-t border-white/10 pt-8">
                  <a href={`tel:${content.contact.phone1}`} className="flex items-center gap-3 mb-4 text-white font-bold">
                    <Phone className="w-5 h-5 text-primary" />
                    {content.contact.phone1}
                  </a>
                  <ScrollLink to="contact" smooth={true} offset={-100}>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                      Оставить заявку
                    </Button>
                  </ScrollLink>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen flex items-center pt-20" data-testid="section-hero">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Кадастровые работы" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/40" />
        </div>

        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-primary font-semibold text-sm mb-8">
                <Zap className="w-4 h-4" />
                В 2024 году выявляют самострой. Торопитесь оформить!
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white leading-tight mb-6" data-testid="text-hero-title">
                {content.hero.title}
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl leading-relaxed" data-testid="text-hero-subtitle">
                {content.hero.subtitle}
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <ScrollLink to="contact" smooth={true} offset={-100}>
                  <Button size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-white shadow-xl glow-primary" data-testid="button-hero-cta">
                    {content.hero.ctaText}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </ScrollLink>
                <a href={getWhatsAppUrl(content.contact.whatsapp)} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/20 text-white hover:bg-white/10" data-testid="button-whatsapp">
                    <SiWhatsapp className="w-5 h-5 mr-2 text-green-400" />
                    WhatsApp
                  </Button>
                </a>
              </div>

              <div className="flex flex-wrap gap-6 text-gray-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Выездной офис</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Работаем в выходные</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span>Договор на результат</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-16 bg-card border-y border-white/5" data-testid="section-stats">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Лет опыта", value: content.stats.years, icon: Clock },
              { label: "Оказанных услуг", value: content.stats.projects, icon: FileText },
              { label: "Межеваний", value: content.stats.landArea, icon: MapPin },
              { label: "Довольных клиентов", value: content.stats.satisfaction, icon: Users }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6"
                data-testid={`stat-${i}`}
              >
                <stat.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PROBLEMS SECTION --- */}
      <section className="py-20 lg:py-28 relative overflow-hidden" data-testid="section-problems">
        <div className="absolute inset-0 z-0">
          <img src={aerialImage} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Вам знакомы эти проблемы?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Большинство заказчиков сталкиваются с этими сложностями</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                title: "Отсутствие договора на результат", 
                text: "Обычно заключают договор на разработку плана, а посещение кадастровой палаты остается вашей проблемой. Мы заключаем договор на результат - получение кадастрового паспорта."
              },
              { 
                title: "Отсутствие оптимального решения", 
                text: "Не зная всех механизмов, инженер не может определить оптимальный путь. Бездумная работа приводит к проблемам на следующих этапах. У нас работают сертифицированные инженеры."
              },
              { 
                title: "Незнание законодательства", 
                text: "Работа по привычному пути приводит к неактуальным этапам работ, что увеличивает бюджет и сроки. Мы следим за изменениями и используем актуальные методы."
              }
            ].map((problem, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-8 rounded-2xl border border-white/10"
              >
                <div className="w-12 h-12 bg-destructive/20 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-destructive text-2xl font-bold">{i + 1}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{problem.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{problem.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- WHY US SECTION --- */}
      <section id="why-us" className="py-20 lg:py-28 bg-card" data-testid="section-why-us">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Почему нам доверяют</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Мы работаем на результат и ценим ваше время</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Users, title: "Консультации бесплатно", text: "Поможем разобраться в вашей ситуации" },
              { icon: Target, title: "Работаем на результат", text: "Договор до получения документов" },
              { icon: Award, title: "Кадастровые инженеры с аттестатом", text: "Члены СРО с подтвержденной квалификацией" },
              { icon: Zap, title: "Геодезия без посредников", text: "Собственное оборудование и специалисты" },
              { icon: Clock, title: "Реальные сроки работ", text: "Называем точные сроки и соблюдаем их" },
              { icon: Shield, title: "Помощь в сложных задачах", text: "Решаем нестандартные ситуации" },
              { icon: FileText, title: "Высокая квалификация", text: "Постоянное обучение и развитие" },
              { icon: CheckCircle, title: "Большой опыт работы", text: "27+ лет в кадастровой сфере" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-xl bg-background/50 border border-white/5 hover:border-primary/30 transition-colors"
              >
                <item.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SERVICES SECTION --- */}
      <section id="services" className="py-20 lg:py-28 relative" data-testid="section-services">
        <div className="absolute inset-0 z-0">
          <img src={documentsImage} alt="" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/98 to-background" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Наши услуги</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Полный спектр кадастровых и геодезических работ</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.services.map((service, i) => {
              const serviceImage = serviceImages[i % serviceImages.length];
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="relative rounded-2xl border border-white/10 hover:border-primary/50 transition-all duration-300 group overflow-hidden"
                  data-testid={`card-service-${service.id}`}
                >
                  <div className="absolute inset-0 z-0">
                    <img src={serviceImage} alt={service.title} className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/95 to-card/80" />
                  </div>
                  <div className="relative z-10 p-8">
                    <div className="w-16 h-16 rounded-xl overflow-hidden mb-6 border border-white/20 group-hover:border-primary/50 transition-colors">
                      <img src={serviceImage} alt={service.title} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{service.title}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">{service.description}</p>
                    <div className="flex items-center justify-between pt-6 border-t border-white/10 group-hover:border-primary/30 transition-colors">
                      <span className="font-bold text-2xl gradient-text">{service.price}</span>
                      <ScrollLink to="contact" smooth={true} offset={-100}>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/10">
                          Заказать <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </ScrollLink>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- PROCESS SECTION --- */}
      <section id="process" className="py-20 lg:py-28 bg-card" data-testid="section-process">
        <div className="container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Как мы работаем</h2>
            <p className="text-xl text-muted-foreground">Простой и понятный процесс от заявки до результата</p>
          </motion.div>
          
          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2"></div>
            
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {[
                { number: "01", title: "Оставляете заявку", text: "Звоните или заполняете форму. Мы бесплатно консультируем и анализируем вашу ситуацию." },
                { number: "02", title: "Выезд и замеры", text: "Приезжаем на объект, проводим геодезические измерения, собираем необходимые данные." },
                { number: "03", title: "Готовые документы", text: "Подготавливаем план, подаем в Росреестр, вы получаете выписку ЕГРН." }
              ].map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="text-center relative"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-400 rounded-full flex items-center justify-center text-3xl font-bold text-white mx-auto mb-6 shadow-xl glow-primary">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-muted-foreground max-w-xs mx-auto">{step.text}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <ScrollLink to="contact" smooth={true} offset={-100}>
              <Button size="lg" className="h-14 px-10 text-lg bg-primary hover:bg-primary/90 shadow-xl glow-primary" data-testid="button-process-cta">
                Начать сейчас
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </ScrollLink>
          </motion.div>
        </div>
      </section>

      {/* --- TESTIMONIALS SECTION --- */}
      <section id="testimonials" className="py-20 lg:py-28 relative" data-testid="section-testimonials">
        <div className="absolute inset-0 z-0">
          <img src={documentsImage} alt="" className="w-full h-full object-cover opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/98 to-background" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Отзывы наших клиентов</h2>
            <p className="text-xl text-muted-foreground">Нам доверяют более 30 000 собственников недвижимости</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {content.testimonials.map((review, i) => (
              <motion.div 
                key={review.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-8 rounded-2xl border border-white/10 hover:border-primary/40 transition-all duration-300"
                data-testid={`card-testimonial-${review.id}`}
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(review.rating || 5)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed text-lg">"{review.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                    {review.name.charAt(0)}
                  </div>
                  <div className="font-bold text-white">{review.name}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA BANNER --- */}
      <section className="py-16 relative overflow-hidden" data-testid="section-cta-banner">
        <div className="absolute inset-0 z-0">
          <img src={surveyorImage} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-blue-600/90" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Не откладывайте важные вопросы на потом</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">Задайте свои вопросы прямо сейчас - это совершенно бесплатно</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href={`tel:${content.contact.phone1.replace(/\s/g, '')}`}>
              <Button size="lg" variant="secondary" className="h-14 px-8 text-lg bg-white text-primary hover:bg-white/90" data-testid="button-cta-call">
                <Phone className="w-5 h-5 mr-2" />
                {content.contact.phone1}
              </Button>
            </a>
            <a href={getWhatsAppUrl(content.contact.whatsapp)} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/30 text-white hover:bg-white/10" data-testid="button-cta-whatsapp">
                <SiWhatsapp className="w-5 h-5 mr-2" />
                WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* --- CONTACT SECTION --- */}
      <section id="contact" className="py-20 lg:py-28 bg-card" data-testid="section-contact">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Оставьте заявку</h2>
                <p className="text-xl text-muted-foreground mb-8">Просто укажите имя и номер телефона. Перезвоним в течение 5 минут и расскажем все подробно.</p>
              </motion.div>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-4 glass rounded-xl">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Телефоны</div>
                    <a href={`tel:${content.contact.phone1.replace(/\s/g, '')}`} className="block text-white font-medium hover:text-primary transition-colors">{content.contact.phone1}</a>
                    <a href={`tel:${content.contact.phone2.replace(/\s/g, '')}`} className="block text-white font-medium hover:text-primary transition-colors">{content.contact.phone2}</a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 glass rounded-xl">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Email</div>
                    <a href={`mailto:${content.contact.email}`} className="text-white font-medium hover:text-primary transition-colors">{content.contact.email}</a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 glass rounded-xl">
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-green-400">
                    <SiWhatsapp className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">WhatsApp</div>
                    <a href={getWhatsAppUrl(content.contact.whatsapp)} target="_blank" rel="noopener noreferrer" className="text-white font-medium hover:text-green-400 transition-colors" data-testid="link-whatsapp-contact">Написать в мессенджер</a>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 glass rounded-xl">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Офис</div>
                    <div className="text-white font-medium">Московская область, Подольск</div>
                    <div className="text-muted-foreground text-sm">Советская площадь, дом 3, офис 37</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-blue-500/20 rounded-3xl blur-xl"></div>
              <div className="relative glass p-8 rounded-2xl border border-white/10">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-white/5" data-testid="section-footer">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-400 rounded-lg flex items-center justify-center text-white">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white">Кадастр-Онлайн</h3>
                  <p className="text-xs text-muted-foreground">Кадастровый инженер</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm max-w-xs">
                Профессиональные кадастровые услуги. Технические планы, межевание, экспертиза. Работаем по всей Московской области.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Услуги</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Технический план</li>
                <li>Межевой план</li>
                <li>Акт обследования</li>
                <li>Экспертиза</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Контакты</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div>{content.contact.phone1}</div>
                <div>{content.contact.phone2}</div>
                <div>{content.contact.email}</div>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/5 text-center text-sm text-muted-foreground">
            <p>ООО Геодезия-БТИ. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
