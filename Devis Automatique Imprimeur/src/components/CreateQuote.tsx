import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Slider } from './ui/slider';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Button } from './ui/button';
import { DatabaseData, Quote } from '../App';
import QuoteSummary from './QuoteSummary';
import { toast } from 'sonner@2.0.3';
import { X } from 'lucide-react';

type Props = {
  data: DatabaseData;
  updateData: (newData: Partial<DatabaseData>) => void;
  editingQuote?: Quote | null;
  onClearEdit?: () => void;
};

type QuoteConfig = {
  productType: string;
  customProduct: string;
  format: string;
  customFormat: string;
  paper: string;
  printType: string;
  finishes: string[];
  quantity: number;
  customQuantity: string;
  margin: number;
  express: boolean;
};

const productTypes = ['Cartes de visite', 'Flyer', 'Affiche', 'Brochure', 'Autre'];
const formats = ['85×55 mm', 'A6 (105×148 mm)', 'A5 (148×210 mm)', 'A4 (210×297 mm)', 'A3 (297×420 mm)', 'Personnalisé'];
const printTypes = ['Quadri recto', 'Quadri recto-verso', 'Pantone'];
const quantities = [100, 250, 500, 1000, 3000, 5000];

export default function CreateQuote({ data, updateData, editingQuote, onClearEdit }: Props) {
  const [config, setConfig] = useState<QuoteConfig>({
    productType: '',
    customProduct: '',
    format: '',
    customFormat: '',
    paper: '',
    printType: 'Quadri recto',
    finishes: [],
    quantity: 500,
    customQuantity: '',
    margin: 40,
    express: false,
  });

  const [clientName, setClientName] = useState('');
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);

  // Load quote for editing
  useEffect(() => {
    if (editingQuote) {
      setClientName(editingQuote.client);
      setEditingQuoteId(editingQuote.id);
      if (editingQuote.configuration) {
        setConfig(editingQuote.configuration);
      }
      toast.info('Modification du devis en cours');
    }
  }, [editingQuote]);

  const updateConfig = (updates: Partial<QuoteConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const toggleFinish = (finishId: string) => {
    setConfig(prev => ({
      ...prev,
      finishes: prev.finishes.includes(finishId)
        ? prev.finishes.filter(id => id !== finishId)
        : [...prev.finishes, finishId]
    }));
  };

  const handleSave = (priceHT: number) => {
    if (!clientName.trim()) {
      toast.error('Veuillez entrer le nom du client');
      return;
    }

    const productName = config.productType === 'Autre' ? config.customProduct : config.productType;
    if (!productName) {
      toast.error('Veuillez sélectionner un type de produit');
      return;
    }

    if (editingQuoteId) {
      // Update existing quote
      const updatedQuotes = data.quotes.map(q =>
        q.id === editingQuoteId
          ? {
              ...q,
              client: clientName,
              product: productName,
              quantity: config.quantity,
              priceHT,
              configuration: config,
            }
          : q
      );
      updateData({ quotes: updatedQuotes });
      toast.success('Devis mis à jour avec succès');
      handleClearForm();
    } else {
      // Create new quote
      const newQuote = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        client: clientName,
        product: productName,
        quantity: config.quantity,
        priceHT,
        status: 'Brouillon' as const,
        configuration: config,
      };

      updateData({ quotes: [...data.quotes, newQuote] });
      toast.success('Devis enregistré avec succès');
      handleClearForm();
    }
  };

  const handleClearForm = () => {
    setClientName('');
    setEditingQuoteId(null);
    setConfig({
      productType: '',
      customProduct: '',
      format: '',
      customFormat: '',
      paper: '',
      printType: 'Quadri recto',
      finishes: [],
      quantity: 500,
      customQuantity: '',
      margin: 40,
      express: false,
    });
    if (onClearEdit) {
      onClearEdit();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
      {/* Left Column - Configuration */}
      <div className="lg:col-span-2 space-y-4 lg:space-y-6">
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
            <h2 className="text-gray-900">
              {editingQuoteId ? 'Modifier le devis' : 'Configuration du devis'}
            </h2>
            {editingQuoteId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearForm}
                className="text-gray-600 hover:text-gray-900 w-full sm:w-auto"
              >
                <X className="w-4 h-4 mr-2" />
                Annuler la modification
              </Button>
            )}
          </div>

          {/* Client Name */}
          <div className="space-y-2 mb-4 sm:mb-6">
            <Label htmlFor="client">Nom du client</Label>
            <Input
              id="client"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Entrez le nom du client"
            />
          </div>

          {/* Product Type */}
          <div className="space-y-2 mb-4 sm:mb-6">
            <Label>Type de produit</Label>
            <Select value={config.productType} onValueChange={(value) => updateConfig({ productType: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un type de produit" />
              </SelectTrigger>
              <SelectContent>
                {productTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {config.productType === 'Autre' && (
              <Input
                value={config.customProduct}
                onChange={(e) => updateConfig({ customProduct: e.target.value })}
                placeholder="Nom du produit personnalisé"
                className="mt-2"
              />
            )}
          </div>

          {/* Format */}
          <div className="space-y-2 mb-4 sm:mb-6">
            <Label>Format</Label>
            <Select value={config.format} onValueChange={(value) => updateConfig({ format: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un format" />
              </SelectTrigger>
              <SelectContent>
                {formats.map(format => (
                  <SelectItem key={format} value={format}>{format}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {config.format === 'Personnalisé' && (
              <Input
                value={config.customFormat}
                onChange={(e) => updateConfig({ customFormat: e.target.value })}
                placeholder="Ex: 200×200 mm"
                className="mt-2"
              />
            )}
          </div>

          {/* Paper */}
          <div className="space-y-2 mb-4 sm:mb-6">
            <Label>Papier</Label>
            <Select value={config.paper} onValueChange={(value) => updateConfig({ paper: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un papier" />
              </SelectTrigger>
              <SelectContent>
                {data.papers.map(paper => (
                  <SelectItem key={paper.id} value={paper.id}>
                    {paper.name} - {paper.grammage}g ({paper.costPerKg}€/kg)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Print Type */}
          <div className="space-y-3 mb-4 sm:mb-6">
            <Label>Type d'impression</Label>
            <RadioGroup value={config.printType} onValueChange={(value) => updateConfig({ printType: value })}>
              {printTypes.map(type => (
                <div key={type} className="flex items-center space-x-3 p-2 sm:p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer" onClick={() => updateConfig({ printType: type })}>
                  <RadioGroupItem value={type} id={type} />
                  <Label htmlFor={type} className="cursor-pointer flex-1 text-sm sm:text-base">{type}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Finishes */}
          <div className="space-y-3 mb-4 sm:mb-6">
            <Label>Finitions</Label>
            <div className="space-y-2">
              {data.finishes.map(finish => (
                <div key={finish.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={finish.id}
                    checked={config.finishes.includes(finish.id)}
                    onCheckedChange={() => toggleFinish(finish.id)}
                  />
                  <Label htmlFor={finish.id} className="cursor-pointer text-sm sm:text-base">
                    {finish.name} (+{finish.unitCost}€/pièce)
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-3 mb-4 sm:mb-6">
            <Label>Quantité</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {quantities.map(qty => (
                <Button
                  key={qty}
                  variant={config.quantity === qty ? 'default' : 'outline'}
                  onClick={() => updateConfig({ quantity: qty, customQuantity: '' })}
                  className="w-full text-xs sm:text-sm"
                >
                  {qty}
                </Button>
              ))}
            </div>
            <Input
              type="number"
              value={config.customQuantity}
              onChange={(e) => updateConfig({ customQuantity: e.target.value, quantity: parseInt(e.target.value) || 0 })}
              placeholder="Autre quantité"
            />
          </div>

          {/* Margin */}
          <div className="space-y-3 mb-4 sm:mb-6">
            <div className="flex items-center justify-between">
              <Label>Marge</Label>
              <span className="text-gray-600">{config.margin}%</span>
            </div>
            <Slider
              value={[config.margin]}
              onValueChange={([value]) => updateConfig({ margin: value })}
              min={0}
              max={100}
              step={5}
            />
          </div>

          {/* Express */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="express"
              checked={config.express}
              onCheckedChange={(checked) => updateConfig({ express: checked as boolean })}
            />
            <Label htmlFor="express" className="cursor-pointer">
              Délai express (+20%)
            </Label>
          </div>
        </Card>
      </div>

      {/* Right Column - Summary */}
      <div className="lg:col-span-1">
        <QuoteSummary 
          config={config} 
          data={data} 
          onSave={handleSave}
          clientName={clientName}
          quoteId={editingQuoteId || undefined}
        />
      </div>
    </div>
  );
}
