import { useState, useEffect } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/ui/tabs";
import { Button } from "./components/ui/button";
import { Printer, Plus, RefreshCw } from "lucide-react";
import CreateQuote from "./components/CreateQuote";
import Database from "./components/Database";
import QuoteHistory from "./components/QuoteHistory";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";
import { fetchData, initializeData, updatePapers, updateFinishes, updateMachines, updateLabor, updateMarginRules, updateQuotes } from "./utils/api";

export type Paper = {
  id: string;
  name: string;
  grammage: number;
  costPerKg: number;
  supplier: string;
  notes: string;
};

export type Finish = {
  id: string;
  name: string;
  unitCost: number;
  setupTime: number;
  machine: string;
  notes: string;
};

export type Machine = {
  id: string;
  name: string;
  type: "impression" | "finition";
  hourlyCost: number;
  cadence: number;
  setupTime: number;
};

export type Labor = {
  id: string;
  position: string;
  hourlyCost: number;
  description: string;
};

export type MarginRule = {
  id: string;
  product: string;
  minMargin: number;
  maxMargin: number;
  expressMultiplier: number;
};

export type Quote = {
  id: string;
  date: string;
  client: string;
  product: string;
  quantity: number;
  priceHT: number;
  status: "Brouillon" | "Envoyé" | "Accepté";
  configuration: any;
};

export type DatabaseData = {
  papers: Paper[];
  finishes: Finish[];
  machines: Machine[];
  labor: Labor[];
  marginRules: MarginRule[];
  quotes: Quote[];
};

const initialData: DatabaseData = {
  papers: [
    {
      id: "1",
      name: "Offset 90g",
      grammage: 90,
      costPerKg: 0.85,
      supplier: "Antalis",
      notes: "Papier standard pour flyers",
    },
    {
      id: "2",
      name: "Couché brillant 135g",
      grammage: 135,
      costPerKg: 1.2,
      supplier: "Igepa",
      notes: "Flyers et brochures haut de gamme",
    },
    {
      id: "3",
      name: "Couché mat 350g",
      grammage: 350,
      costPerKg: 1.85,
      supplier: "Antalis",
      notes: "Cartes de visite premium",
    },
    {
      id: "4",
      name: "Recyclé 120g",
      grammage: 120,
      costPerKg: 0.95,
      supplier: "Igepa",
      notes: "Option écologique",
    },
    {
      id: "5",
      name: "Création 300g",
      grammage: 300,
      costPerKg: 2.1,
      supplier: "Arjowiggins",
      notes: "Cartes de visite texturées",
    },
  ],
  finishes: [
    {
      id: "1",
      name: "Pelliculage mat",
      unitCost: 0.08,
      setupTime: 15,
      machine: "Plastifieuse",
      notes: "Protection standard",
    },
    {
      id: "2",
      name: "Pelliculage brillant",
      unitCost: 0.08,
      setupTime: 15,
      machine: "Plastifieuse",
      notes: "Finition brillante",
    },
    {
      id: "3",
      name: "Vernis sélectif",
      unitCost: 0.15,
      setupTime: 30,
      machine: "Sérigraphie",
      notes: "Effet premium",
    },
    {
      id: "4",
      name: "Dorure",
      unitCost: 0.35,
      setupTime: 45,
      machine: "Machine à dorer",
      notes: "Effet luxe",
    },
  ],
  machines: [
    {
      id: "1",
      name: "Offset numérique HP",
      type: "impression",
      hourlyCost: 45,
      cadence: 5000,
      setupTime: 20,
    },
    {
      id: "2",
      name: "Massicot automatique",
      type: "finition",
      hourlyCost: 25,
      cadence: 3000,
      setupTime: 10,
    },
  ],
  labor: [
    {
      id: "1",
      position: "Opérateur impression",
      hourlyCost: 22,
      description: "Supervision machine et contrôle qualité",
    },
    {
      id: "2",
      position: "Façonneur",
      hourlyCost: 18,
      description: "Finitions manuelles et conditionnement",
    },
  ],
  marginRules: [
    {
      id: "1",
      product: "Cartes de visite",
      minMargin: 30,
      maxMargin: 60,
      expressMultiplier: 1.2,
    },
    {
      id: "2",
      product: "Flyer",
      minMargin: 25,
      maxMargin: 50,
      expressMultiplier: 1.2,
    },
    {
      id: "3",
      product: "Brochure",
      minMargin: 35,
      maxMargin: 65,
      expressMultiplier: 1.25,
    },
  ],
  quotes: [
    {
      id: "1",
      date: "2025-11-01",
      client: "Société ABC",
      product: "Cartes de visite",
      quantity: 500,
      priceHT: 125.5,
      status: "Accepté",
      configuration: {},
    },
    {
      id: "2",
      date: "2025-11-02",
      client: "Restaurant Le Gourmet",
      product: "Flyer A5",
      quantity: 1000,
      priceHT: 285.0,
      status: "Envoyé",
      configuration: {},
    },
    {
      id: "3",
      date: "2025-11-03",
      client: "Salon Beauté",
      product: "Affiche A3",
      quantity: 50,
      priceHT: 95.0,
      status: "Brouillon",
      configuration: {},
    },
  ],
};

export default function App() {
  const [activeTab, setActiveTab] = useState("quote");
  const [data, setData] = useState<DatabaseData>(initialData);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from Supabase on mount
  useEffect(() => {
    loadDataFromServer();
  }, []);

  const loadDataFromServer = async () => {
    setIsLoading(true);
    try {
      const serverData = await fetchData();
      
      if (serverData) {
        // Check if server has data
        const hasData = serverData.papers && serverData.papers.length > 0;
        
        if (hasData) {
          // Use server data
          setData(serverData);
          toast.success('Données chargées depuis le serveur');
        } else {
          // Initialize server with default data
          const initialized = await initializeData(initialData);
          if (initialized) {
            setData(initialData);
            toast.success('Données initialisées sur le serveur');
          } else {
            setData(initialData);
            toast.error('Erreur lors de l\'initialisation des données');
          }
        }
      } else {
        // Fallback to initial data if server is not accessible
        setData(initialData);
        toast.warning('Utilisation des données locales (serveur non accessible)');
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setData(initialData);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const updateData = async (newData: Partial<DatabaseData>) => {
    const updatedData = { ...data, ...newData };
    setData(updatedData);

    // Sync with server
    try {
      if (newData.papers) {
        await updatePapers(newData.papers);
      }
      if (newData.finishes) {
        await updateFinishes(newData.finishes);
      }
      if (newData.machines) {
        await updateMachines(newData.machines);
      }
      if (newData.labor) {
        await updateLabor(newData.labor);
      }
      if (newData.marginRules) {
        await updateMarginRules(newData.marginRules);
      }
      if (newData.quotes) {
        await updateQuotes(newData.quotes);
      }
    } catch (error) {
      console.error('Error syncing data with server:', error);
      toast.error('Erreur lors de la synchronisation avec le serveur');
    }
  };

  const handleEditQuote = (quote: Quote) => {
    setEditingQuote(quote);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center">
              <img
                src="https://assets.mywebsite-editor.com/user/d4c280a9-bdb6-49cd-9f50-3d99406a928d/262a8980-cc84-4ff6-b476-68896062c654"
                alt="PEP'S PRINT Logo"
                className="h-8 sm:h-10 w-auto object-contain"
              />
            </div>
            <div className="flex gap-1.5 sm:gap-2">
              <Button
                variant="outline"
                onClick={() => loadDataFromServer()}
                disabled={isLoading}
                title="Synchroniser avec le serveur"
                size="sm"
                className="h-9 w-9 sm:h-10 sm:w-10 p-0"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              <Button
                onClick={() => setActiveTab("quote")}
                className="bg-gray-900 hover:bg-gray-800 h-9 sm:h-10 text-xs sm:text-sm"
                size="sm"
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">Nouveau devis</span>
                <span className="sm:hidden ml-1">Nouveau</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement des données...</p>
            </div>
          </div>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4 sm:space-y-6"
          >
            <TabsList className="bg-white border border-gray-200 w-full grid grid-cols-3 h-auto gap-1 p-1">
              <TabsTrigger 
                value="quote" 
                className="text-xs sm:text-sm px-2 sm:px-3 py-2 data-[state=active]:bg-gray-900 data-[state=active]:text-white hover:bg-gray-100 transition-colors"
              >
                <span className="hidden sm:inline">Créer un devis</span>
                <span className="sm:hidden">Devis</span>
              </TabsTrigger>
              <TabsTrigger 
                value="database" 
                className="text-xs sm:text-sm px-2 sm:px-3 py-2 data-[state=active]:bg-gray-900 data-[state=active]:text-white hover:bg-gray-100 transition-colors"
              >
                <span className="hidden sm:inline">Base de données</span>
                <span className="sm:hidden">Base</span>
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className="text-xs sm:text-sm px-2 sm:px-3 py-2 data-[state=active]:bg-gray-900 data-[state=active]:text-white hover:bg-gray-100 transition-colors"
              >
                <span className="hidden sm:inline">Historique</span>
                <span className="sm:hidden">Historique</span>
              </TabsTrigger>
          </TabsList>

          <TabsContent value="quote" className="mt-0">
            <CreateQuote
              data={data}
              updateData={updateData}
              editingQuote={editingQuote}
              onClearEdit={() => setEditingQuote(null)}
            />
          </TabsContent>

          <TabsContent value="database" className="mt-0">
            <Database data={data} updateData={updateData} />
          </TabsContent>

            <TabsContent value="history" className="mt-0">
              <QuoteHistory
                data={data}
                updateData={updateData}
                setActiveTab={setActiveTab}
                onEditQuote={handleEditQuote}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>

      <Toaster />
    </div>
  );
}