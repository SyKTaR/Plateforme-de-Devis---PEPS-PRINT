import { useMemo, useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Download, Save, Send } from 'lucide-react';
import { DatabaseData, Quote } from '../App';
import { toast } from 'sonner@2.0.3';
import { generateQuotePDF } from '../utils/pdfGenerator';

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

type Props = {
  config: QuoteConfig;
  data: DatabaseData;
  onSave: (priceHT: number) => void;
  clientName?: string;
  quoteId?: string;
};

export default function QuoteSummary({ config, data, onSave, clientName, quoteId }: Props) {
  const [isSaving, setIsSaving] = useState(false);
  const calculation = useMemo(() => {
    const costs = {
      paper: 0,
      setup: 0,
      printing: 0,
      finishes: 0,
      labor: 0,
    };

    // Paper cost calculation (simplified)
    if (config.paper && config.quantity > 0) {
      const paper = data.papers.find(p => p.id === config.paper);
      if (paper) {
        // Simplified: assuming A4 size, 1 sheet = 0.06237 m²
        // Weight per sheet = surface (m²) × grammage (g/m²) / 1000 = kg
        const weightPerSheet = 0.06237 * paper.grammage / 1000;
        costs.paper = weightPerSheet * paper.costPerKg * config.quantity;
      }
    }

    // Setup cost
    const printMachine = data.machines.find(m => m.type === 'impression');
    if (printMachine) {
      costs.setup = (printMachine.setupTime / 60) * printMachine.hourlyCost;
    }

    // Printing cost
    if (printMachine && config.quantity > 0) {
      const printingTime = config.quantity / printMachine.cadence;
      costs.printing = printingTime * printMachine.hourlyCost;
      
      // Double cost for recto-verso
      if (config.printType === 'Quadri recto-verso') {
        costs.printing *= 1.5;
      } else if (config.printType === 'Pantone') {
        costs.printing *= 1.3;
      }
    }

    // Finishes cost
    config.finishes.forEach(finishId => {
      const finish = data.finishes.find(f => f.id === finishId);
      if (finish) {
        costs.finishes += finish.unitCost * config.quantity;
        // Add setup time cost
        costs.setup += (finish.setupTime / 60) * (data.machines.find(m => m.type === 'finition')?.hourlyCost || 25);
      }
    });

    // Labor cost (estimated at 10% of production costs)
    const productionCosts = costs.paper + costs.printing + costs.finishes;
    costs.labor = productionCosts * 0.1;

    const totalCost = Object.values(costs).reduce((sum, cost) => sum + cost, 0);
    
    // Apply margin
    const marginMultiplier = 1 + (config.margin / 100);
    let priceHT = totalCost * marginMultiplier;

    // Apply express surcharge
    if (config.express) {
      priceHT *= 1.2;
    }

    const tva = priceHT * 0.20;
    const priceTTC = priceHT + tva;

    return {
      costs,
      totalCost,
      priceHT,
      tva,
      priceTTC,
    };
  }, [config, data]);

  const handleExportPDF = () => {
    if (!clientName) {
      toast.error('Veuillez d\'abord enregistrer le devis');
      return;
    }

    try {
      const tempQuote: Quote = {
        id: quoteId || Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        client: clientName,
        product: config.productType === 'Autre' ? config.customProduct : config.productType,
        quantity: config.quantity,
        priceHT: calculation.priceHT,
        status: 'Brouillon',
        configuration: config,
      };

      generateQuotePDF(tempQuote, data);
      toast.success('PDF téléchargé avec succès');
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      toast.error('Erreur lors du téléchargement du PDF');
    }
  };

  const handleSaveAndDownload = async () => {
    setIsSaving(true);
    await onSave(calculation.priceHT);
    setIsSaving(false);
    
    // Wait a bit for the save to complete, then download
    setTimeout(() => {
      handleExportPDF();
    }, 500);
  };

  const handleSendClient = () => {
    toast.info('Fonctionnalité d\'envoi par email à venir');
  };

  return (
    <Card className="p-4 sm:p-6 lg:sticky lg:top-24">
      <h3 className="text-gray-900 mb-3 sm:mb-4">Récapitulatif</h3>

      <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
        <div className="flex justify-between text-gray-600 text-sm sm:text-base">
          <span>Papier</span>
          <span>{calculation.costs.paper.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between text-gray-600 text-sm sm:text-base">
          <span>Calage</span>
          <span>{calculation.costs.setup.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between text-gray-600 text-sm sm:text-base">
          <span>Tirage</span>
          <span>{calculation.costs.printing.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between text-gray-600 text-sm sm:text-base">
          <span>Finitions</span>
          <span>{calculation.costs.finishes.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between text-gray-600 text-sm sm:text-base">
          <span>Main d'œuvre</span>
          <span>{calculation.costs.labor.toFixed(2)} €</span>
        </div>
      </div>

      <Separator className="my-3 sm:my-4" />

      <div className="space-y-2 mb-3 sm:mb-4">
        <div className="flex justify-between text-gray-600 text-sm sm:text-base">
          <span>Coût total</span>
          <span>{calculation.totalCost.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between text-gray-600 text-sm sm:text-base">
          <span>Marge ({config.margin}%)</span>
          <span>{(calculation.priceHT - calculation.totalCost).toFixed(2)} €</span>
        </div>
        {config.express && (
          <div className="flex justify-between text-gray-600 text-sm sm:text-base">
            <span>Express (+20%)</span>
            <span>{(calculation.priceHT / 1.2 * 0.2).toFixed(2)} €</span>
          </div>
        )}
      </div>

      <Separator className="my-3 sm:my-4" />

      <div className="space-y-2 mb-4 sm:mb-6">
        <div className="flex justify-between text-sm sm:text-base">
          <span className="text-gray-900">Total HT</span>
          <span className="text-gray-900">{calculation.priceHT.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between text-gray-600 text-sm sm:text-base">
          <span>TVA (20%)</span>
          <span>{calculation.tva.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between text-sm sm:text-base">
          <span className="text-gray-900">Total TTC</span>
          <span className="text-gray-900">{calculation.priceTTC.toFixed(2)} €</span>
        </div>
      </div>

      <div className="space-y-2">
        <Button 
          className="w-full bg-gray-900 hover:bg-gray-800 text-sm sm:text-base"
          onClick={() => onSave(calculation.priceHT)}
          disabled={isSaving}
        >
          <Save className="w-4 h-4 mr-2" />
          {quoteId ? 'Mettre à jour' : 'Enregistrer'}
        </Button>
        {clientName && (
          <Button variant="outline" className="w-full text-sm sm:text-base" onClick={handleExportPDF}>
            <Download className="w-4 h-4 mr-2" />
            Télécharger PDF
          </Button>
        )}
        {!clientName && (
          <Button variant="outline" className="w-full text-sm sm:text-base" onClick={handleSaveAndDownload} disabled={isSaving}>
            <Download className="w-4 h-4 mr-2" />
            Enregistrer & Télécharger
          </Button>
        )}
      </div>
    </Card>
  );
}
