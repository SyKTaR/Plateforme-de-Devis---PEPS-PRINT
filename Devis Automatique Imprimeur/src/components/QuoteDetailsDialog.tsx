import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Quote, DatabaseData } from '../App';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Download } from 'lucide-react';
import { generateQuotePDF } from '../utils/pdfGenerator';
import { toast } from 'sonner@2.0.3';

type Props = {
  quote: Quote | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: DatabaseData;
};

export default function QuoteDetailsDialog({ quote, open, onOpenChange, data }: Props) {
  if (!quote) return null;

  const getPaperName = (paperId: string) => {
    const paper = data.papers.find(p => p.id === paperId);
    return paper ? `${paper.name} - ${paper.grammage}g` : 'N/A';
  };

  const getFinishNames = (finishIds: string[]) => {
    return finishIds.map(id => {
      const finish = data.finishes.find(f => f.id === id);
      return finish?.name || 'N/A';
    }).join(', ') || 'Aucune';
  };

  const config = quote.configuration;
  const priceTTC = quote.priceHT * 1.20;

  const handleDownload = () => {
    try {
      generateQuotePDF(quote, data);
      toast.success('PDF téléchargé avec succès');
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      toast.error('Erreur lors du téléchargement du PDF');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">Détails du devis</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Client Info */}
          <div>
            <h3 className="text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Informations client</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <div>
                <span className="text-gray-600 text-xs sm:text-sm">Client</span>
                <p className="text-gray-900 text-sm sm:text-base">{quote.client}</p>
              </div>
              <div>
                <span className="text-gray-600 text-xs sm:text-sm">Date</span>
                <p className="text-gray-900 text-sm sm:text-base">{new Date(quote.date).toLocaleDateString('fr-FR')}</p>
              </div>
              <div>
                <span className="text-gray-600 text-xs sm:text-sm">Statut</span>
                <div className="mt-1">
                  <Badge className={
                    quote.status === 'Accepté' ? 'bg-green-100 text-green-800 border-green-200' :
                    quote.status === 'Envoyé' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                    'bg-gray-100 text-gray-800 border-gray-200'
                  }>
                    {quote.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Product Info */}
          {config && (
            <>
              <div>
                <h3 className="text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Configuration du produit</h3>
                <div className="space-y-1.5 sm:space-y-2">
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-600 text-xs sm:text-sm">Produit</span>
                    <span className="text-gray-900 text-xs sm:text-sm text-right">{quote.product}</span>
                  </div>
                  {config.format && (
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-600 text-xs sm:text-sm">Format</span>
                      <span className="text-gray-900 text-xs sm:text-sm text-right">
                        {config.format === 'Personnalisé' ? config.customFormat : config.format}
                      </span>
                    </div>
                  )}
                  {config.paper && (
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-600 text-xs sm:text-sm">Papier</span>
                      <span className="text-gray-900 text-xs sm:text-sm text-right">{getPaperName(config.paper)}</span>
                    </div>
                  )}
                  {config.printType && (
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-600 text-xs sm:text-sm">Impression</span>
                      <span className="text-gray-900 text-xs sm:text-sm text-right">{config.printType}</span>
                    </div>
                  )}
                  {config.finishes && config.finishes.length > 0 && (
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-600 text-xs sm:text-sm">Finitions</span>
                      <span className="text-gray-900 text-xs sm:text-sm text-right">{getFinishNames(config.finishes)}</span>
                    </div>
                  )}
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-600 text-xs sm:text-sm">Quantité</span>
                    <span className="text-gray-900 text-xs sm:text-sm text-right">{quote.quantity}</span>
                  </div>
                  {config.margin !== undefined && (
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-600 text-xs sm:text-sm">Marge appliquée</span>
                      <span className="text-gray-900 text-xs sm:text-sm text-right">{config.margin}%</span>
                    </div>
                  )}
                  {config.express && (
                    <div className="flex justify-between gap-2">
                      <span className="text-gray-600 text-xs sm:text-sm">Délai express</span>
                      <span className="text-gray-900 text-xs sm:text-sm text-right">Oui (+20%)</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator />
            </>
          )}

          {/* Pricing */}
          <div>
            <h3 className="text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Tarification</h3>
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-900 text-sm sm:text-base">Total HT</span>
                <span className="text-gray-900 text-sm sm:text-base">{quote.priceHT.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span className="text-xs sm:text-sm">TVA (20%)</span>
                <span className="text-xs sm:text-sm">{(quote.priceHT * 0.20).toFixed(2)} €</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-gray-900 text-sm sm:text-base">Total TTC</span>
                <span className="text-gray-900 text-sm sm:text-base">{priceTTC.toFixed(2)} €</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
            onClick={handleDownload}
            className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800"
          >
            <Download className="w-4 h-4 mr-2" />
            Télécharger PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
