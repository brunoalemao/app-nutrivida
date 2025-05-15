
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { UserProfile } from '@/types/user';
import { toast } from 'sonner';

interface ProfileFormProps {
  onSubmit: (profile: Partial<UserProfile>) => void;
  initialData?: Partial<UserProfile>;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    age: initialData.age || 30,
    gender: initialData.gender || 'masculino',
    height: initialData.height || 170,
    currentWeight: initialData.currentWeight || 70,
    goalWeight: initialData.goalWeight || 65,
    activityLevel: initialData.activityLevel || 'leve',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' || name === 'height' || name === 'currentWeight' || name === 'goalWeight' ? 
        parseFloat(value) : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSliderChange = (name: string, value: number[]) => {
    setFormData(prev => ({
      ...prev,
      [name]: value[0]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações simples
    if (!formData.age || formData.age < 18 || formData.age > 100) {
      toast.error('Por favor, insira uma idade válida entre 18 e 100 anos.');
      return;
    }
    
    if (!formData.height || formData.height < 100 || formData.height > 250) {
      toast.error('Por favor, insira uma altura válida entre 100 e 250 cm.');
      return;
    }
    
    if (!formData.currentWeight || formData.currentWeight < 30 || formData.currentWeight > 300) {
      toast.error('Por favor, insira um peso atual válido entre 30 e 300 kg.');
      return;
    }
    
    if (!formData.goalWeight || formData.goalWeight < 30 || formData.goalWeight > 300) {
      toast.error('Por favor, insira um peso meta válido entre 30 e 300 kg.');
      return;
    }
    
    if (formData.goalWeight > formData.currentWeight) {
      toast.error('O peso meta deve ser menor que o peso atual para emagrecimento.');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="age">Idade</Label>
          <Input 
            id="age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            min={18}
            max={100}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="gender">Gênero</Label>
          <Select 
            onValueChange={(value) => handleSelectChange('gender', value)} 
            defaultValue={formData.gender}
          >
            <SelectTrigger id="gender">
              <SelectValue placeholder="Selecione seu gênero" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="masculino">Masculino</SelectItem>
              <SelectItem value="feminino">Feminino</SelectItem>
              <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="height">Altura (cm)</Label>
          <Input 
            id="height"
            name="height"
            type="number"
            value={formData.height}
            onChange={handleChange}
            min={100}
            max={250}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="currentWeight">Peso Atual (kg)</Label>
          <Input 
            id="currentWeight"
            name="currentWeight"
            type="number"
            value={formData.currentWeight}
            onChange={handleChange}
            min={30}
            max={300}
            step="0.1"
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="goalWeight">Peso Desejado (kg)</Label>
          <Input 
            id="goalWeight"
            name="goalWeight"
            type="number"
            value={formData.goalWeight}
            onChange={handleChange}
            min={30}
            max={300}
            step="0.1"
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="activityLevel">Nível de Atividade Física</Label>
          <Select 
            onValueChange={(value) => handleSelectChange('activityLevel', value)} 
            defaultValue={formData.activityLevel}
          >
            <SelectTrigger id="activityLevel">
              <SelectValue placeholder="Selecione seu nível de atividade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentario">Sedentário (pouco ou nenhum exercício)</SelectItem>
              <SelectItem value="leve">Levemente ativo (exercício leve 1-3 dias/semana)</SelectItem>
              <SelectItem value="moderado">Moderadamente ativo (exercício moderado 3-5 dias/semana)</SelectItem>
              <SelectItem value="ativo">Muito ativo (exercício intenso 6-7 dias/semana)</SelectItem>
              <SelectItem value="muito_ativo">Extremamente ativo (exercício muito intenso, trabalho físico)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Button type="submit" className="w-full bg-nutrivida-primary hover:bg-nutrivida-dark">
        Salvar Perfil
      </Button>
    </form>
  );
};

export default ProfileForm;
