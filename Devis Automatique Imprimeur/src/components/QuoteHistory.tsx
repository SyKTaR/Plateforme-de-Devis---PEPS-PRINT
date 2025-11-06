import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { Search, Eye, Edit, Download, Trash2 } from 'lucide-react';
import { DatabaseData, Quote } from '../App';
import { toast } from 'sonner@2.0.3';
import QuoteDetailsDialog from './QuoteDetailsDialog';
import { generateQuotePDF } from '../utils/pdfGenerator';

type Props = {
  data: DatabaseData;
  updateData: (newData: Partial<DatabaseData>) => void;
  setActiveTab: (tab: string) => void;
  onEditQuote?: (quote: Quote) => void;
};

export default function QuoteHistory({ data, updateData, setActiveTab, onEditQuote }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState<string | null>(null);

  const filteredQuotes = data.quotes.filter(quote => 
    quote.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (quote: Quote) => {
    setSelectedQuote(quote);
    setViewDialogOpen(true);
  };

  const handleEdit = (quote: Quote) => {
    if (onEditQuote) {
      onEditQuote(quote);
      setActiveTab('quote');
      toast.success('Devis chargé pour modification');
    } else {
      toast.info('Fonctionnalité en cours de développement');
    }
  };

  const handleDownload = (quote: Quote) => {
    try {
      generateQuotePDF(quote, data);
      toast.success('PDF téléchargé avec succès');
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      toast.error('Erreur lors du téléchargement du PDF');
    }
  };

  const handleDeleteClick = (quoteId: string) => {
    setQuoteToDelete(quoteId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (quoteToDelete) {
      const updatedQuotes = data.quotes.filter(q => q.id !== quoteToDelete);
      updateData({ quotes: updatedQuotes });
      toast.success('Devis supprimé');
      setQuoteToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleStatusChange = (quoteId: string, newStatus: Quote['status']) => {
    const updatedQuotes = data.quotes.map(q =>
      q.id === quoteId ? { ...q, status: newStatus } : q
    );
    updateData({ quotes: updatedQuotes });
    toast.success(`Statut modifié : ${newStatus}`);
  };

  const getStatusBadge = (status: Quote['status']) => {
    const variants = {
      'Brouillon': 'secondary',
      'Envoyé': 'default',
      'Accepté': 'default',
    };
    
    return (
      <Badge variant={variants[status] as any} className={
        status === 'Accepté' ? 'bg-green-100 text-green-800 border-green-200' :
        status === 'Envoyé' ? 'bg-blue-100 text-blue-800 border-blue-200' :
        'bg-gray-100 text-gray-800 border-gray-200'
      }>
        {status}
      </Badge>
    );
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-gray-900">Historique des devis</h2>
      </div>

      <Card className="p-4 sm:p-6">
        <div className="mb-4 sm:mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un client ou un produit..."
              className="pl-10 text-sm sm:text-base"
            />
          </div>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[90px] text-xs sm:text-sm">Date</TableHead>
                <TableHead className="min-w-[120px] text-xs sm:text-sm">Client</TableHead>
                <TableHead className="min-w-[120px] text-xs sm:text-sm">Produit</TableHead>
                <TableHead className="min-w-[80px] text-xs sm:text-sm">Quantité</TableHead>
                <TableHead className="min-w-[90px] text-xs sm:text-sm">Prix HT</TableHead>
                <TableHead className="min-w-[140px] text-xs sm:text-sm">Statut</TableHead>
                <TableHead className="text-right min-w-[180px] text-xs sm:text-sm">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuotes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500 py-8 text-sm sm:text-base">
                    Aucun devis trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredQuotes.map(quote => (
                  <TableRow key={quote.id}>
                    <TableCell className="text-xs sm:text-sm">{new Date(quote.date).toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{quote.client}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{quote.product}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{quote.quantity}</TableCell>
                    <TableCell className="text-xs sm:text-sm">{quote.priceHT.toFixed(2)} €</TableCell>
                    <TableCell>
                      <Select
                        value={quote.status}
                        onValueChange={(value) => handleStatusChange(quote.id, value as Quote['status'])}
                      >
                        <SelectTrigger className="w-[120px] sm:w-[140px] h-7 sm:h-8 text-xs sm:text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Brouillon">
                            <span className="flex items-center gap-2 text-xs sm:text-sm">
                              <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                              Brouillon
                            </span>
                          </SelectItem>
                          <SelectItem value="Envoyé">
                            <span className="flex items-center gap-2 text-xs sm:text-sm">
                              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                              Envoyé
                            </span>
                          </SelectItem>
                          <SelectItem value="Accepté">
                            <span className="flex items-center gap-2 text-xs sm:text-sm">
                              <span className="w-2 h-2 rounded-full bg-green-500"></span>
                              Accepté
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-0.5 sm:gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(quote)}
                          title="Voir les détails"
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(quote)}
                          title="Modifier"
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(quote)}
                          title="Télécharger PDF"
                          className="h-8 w-8 p-0"
                        >
                          <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(quote.id)}
                          title="Supprimer"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                        >
                          <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
            </div>
          </div>
        </div>
      </Card>

      {/* View Details Dialog */}
      <QuoteDetailsDialog
        quote={selectedQuote}
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        data={data}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce devis ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
