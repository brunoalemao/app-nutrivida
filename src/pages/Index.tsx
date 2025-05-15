
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import AppHeader from '@/components/AppHeader';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-nutrivida-light">
      <AppHeader />
      
      <section className="flex-grow flex items-center">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="lg:w-1/2 space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-montserrat text-gray-800 leading-tight">
                Transforme sua vida com o{" "}
                <span className="text-nutrivida-primary">NutriVida</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 max-w-xl">
                Sua jornada de emagrecimento personalizada, com planos alimentares inteligentes 
                e acompanhamento contínuo para ajudar você a alcançar seus objetivos de saúde.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-nutrivida-primary hover:bg-nutrivida-dark text-lg px-8">
                  <Link to="/cadastro">Começar Agora</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-nutrivida-primary text-nutrivida-primary hover:bg-nutrivida-light text-lg px-8">
                  <Link to="/sobre">Saiba Mais</Link>
                </Button>
              </div>
              
              <div className="grid grid-cols-3 gap-6 pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="text-3xl font-bold text-nutrivida-primary mb-1">100%</div>
                  <div className="text-sm text-gray-600">Personalizado</div>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="text-3xl font-bold text-nutrivida-primary mb-1">IA</div>
                  <div className="text-sm text-gray-600">Avançada</div>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="text-3xl font-bold text-nutrivida-primary mb-1">24/7</div>
                  <div className="text-sm text-gray-600">Disponível</div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-nutrivida-secondary/20 rounded-full z-0"></div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-nutrivida-primary/20 rounded-full z-0"></div>
                
                <div className="relative z-10 bg-white p-6 rounded-2xl shadow-xl">
                  <img 
                    src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80" 
                    alt="Alimentação saudável" 
                    className="w-full h-auto rounded-lg object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Como o NutriVida funciona</h2>
            <p className="text-gray-600">Nossa plataforma integra tecnologia avançada e conhecimentos de nutrição para criar um plano de emagrecimento que realmente funciona para você.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-nutrivida-light p-6 rounded-xl text-center">
              <div className="bg-nutrivida-primary w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Crie seu perfil</h3>
              <p className="text-gray-600">Insira seus dados como peso, altura e objetivos para que possamos entender suas necessidades.</p>
            </div>
            
            <div className="bg-nutrivida-light p-6 rounded-xl text-center">
              <div className="bg-nutrivida-primary w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Receba seu plano</h3>
              <p className="text-gray-600">Nossa IA criará um plano alimentar personalizado para ajudar você a alcançar seus objetivos.</p>
            </div>
            
            <div className="bg-nutrivida-light p-6 rounded-xl text-center">
              <div className="bg-nutrivida-primary w-12 h-12 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Acompanhe seu progresso</h3>
              <p className="text-gray-600">Registre seu peso e veja sua evolução em tempo real enquanto caminha para sua meta.</p>
            </div>
          </div>
        </div>
      </section>
      
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h3 className="text-2xl font-bold mb-4 text-nutrivida-primary">NutriVida</h3>
              <p className="max-w-xs text-gray-300">Sua plataforma de emagrecimento inteligente que coloca sua saúde em primeiro lugar.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold text-lg mb-4">Links Rápidos</h4>
                <ul className="space-y-2">
                  <li><Link to="/" className="text-gray-300 hover:text-white">Início</Link></li>
                  <li><Link to="/sobre" className="text-gray-300 hover:text-white">Sobre</Link></li>
                  <li><Link to="/cadastro" className="text-gray-300 hover:text-white">Cadastro</Link></li>
                  <li><Link to="/login" className="text-gray-300 hover:text-white">Login</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-lg mb-4">Suporte</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-300 hover:text-white">Contato</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">FAQ</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">Termos de Uso</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">Privacidade</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} NutriVida. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
