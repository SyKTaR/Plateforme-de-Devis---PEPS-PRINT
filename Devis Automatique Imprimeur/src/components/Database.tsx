import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Trash2, Save, AlertCircle } from 'lucide-react';
import { DatabaseData, Paper, Finish, Machine, Labor, MarginRule } from '../App';
import { toast } from 'sonner@2.0.3';

type Props = {
  data: DatabaseData;
  updateData: (newData: Partial<DatabaseData>) => void;
};

export default function Database({ data, updateData }: Props) {
  const [editingPapers, setEditingPapers] = useState<Paper[]>(data.papers);
  const [editingFinishes, setEditingFinishes] = useState<Finish[]>(data.finishes);
  const [editingMachines, setEditingMachines] = useState<Machine[]>(data.machines);
  const [editingLabor, setEditingLabor] = useState<Labor[]>(data.labor);
  const [editingMarginRules, setEditingMarginRules] = useState<MarginRule[]>(data.marginRules);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Sync with parent data when it changes (e.g., after loading from Supabase)
  useEffect(() => {
    setEditingPapers(data.papers);
    setEditingFinishes(data.finishes);
    setEditingMachines(data.machines);
    setEditingLabor(data.labor);
    setEditingMarginRules(data.marginRules);
    setHasUnsavedChanges(false);
  }, [data.papers, data.finishes, data.machines, data.labor, data.marginRules]);

  const saveAll = async () => {
    await updateData({
      papers: editingPapers,
      finishes: editingFinishes,
      machines: editingMachines,
      labor: editingLabor,
      marginRules: editingMarginRules,
    });
    setHasUnsavedChanges(false);
    toast.success('✅ Base de données sauvegardée sur le serveur');
  };

  const resetAll = () => {
    setEditingPapers(data.papers);
    setEditingFinishes(data.finishes);
    setEditingMachines(data.machines);
    setEditingLabor(data.labor);
    setEditingMarginRules(data.marginRules);
    setHasUnsavedChanges(false);
    toast.info('Modifications annulées');
  };

  // Papers functions
  const updatePaper = (id: string, field: keyof Paper, value: any) => {
    setEditingPapers(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    setHasUnsavedChanges(true);
  };

  const addPaper = () => {
    const newPaper: Paper = {
      id: Date.now().toString(),
      name: 'Nouveau papier',
      grammage: 100,
      costPerKg: 1.0,
      supplier: '',
      notes: '',
    };
    setEditingPapers(prev => [...prev, newPaper]);
    setHasUnsavedChanges(true);
  };

  const deletePaper = (id: string) => {
    setEditingPapers(prev => prev.filter(p => p.id !== id));
    setHasUnsavedChanges(true);
  };

  // Finishes functions
  const updateFinish = (id: string, field: keyof Finish, value: any) => {
    setEditingFinishes(prev => prev.map(f => f.id === id ? { ...f, [field]: value } : f));
    setHasUnsavedChanges(true);
  };

  const addFinish = () => {
    const newFinish: Finish = {
      id: Date.now().toString(),
      name: 'Nouvelle finition',
      unitCost: 0.1,
      setupTime: 15,
      machine: '',
      notes: '',
    };
    setEditingFinishes(prev => [...prev, newFinish]);
    setHasUnsavedChanges(true);
  };

  const deleteFinish = (id: string) => {
    setEditingFinishes(prev => prev.filter(f => f.id !== id));
    setHasUnsavedChanges(true);
  };

  // Machines functions
  const updateMachine = (id: string, field: keyof Machine, value: any) => {
    setEditingMachines(prev => prev.map(m => m.id === id ? { ...m, [field]: value } : m));
    setHasUnsavedChanges(true);
  };

  const addMachine = () => {
    const newMachine: Machine = {
      id: Date.now().toString(),
      name: 'Nouvelle machine',
      type: 'impression',
      hourlyCost: 30,
      cadence: 1000,
      setupTime: 15,
    };
    setEditingMachines(prev => [...prev, newMachine]);
    setHasUnsavedChanges(true);
  };

  const deleteMachine = (id: string) => {
    setEditingMachines(prev => prev.filter(m => m.id !== id));
    setHasUnsavedChanges(true);
  };

  // Labor functions
  const updateLabor = (id: string, field: keyof Labor, value: any) => {
    setEditingLabor(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
    setHasUnsavedChanges(true);
  };

  const addLabor = () => {
    const newLabor: Labor = {
      id: Date.now().toString(),
      position: 'Nouveau poste',
      hourlyCost: 20,
      description: '',
    };
    setEditingLabor(prev => [...prev, newLabor]);
    setHasUnsavedChanges(true);
  };

  const deleteLabor = (id: string) => {
    setEditingLabor(prev => prev.filter(l => l.id !== id));
    setHasUnsavedChanges(true);
  };

  // Margin Rules functions
  const updateMarginRule = (id: string, field: keyof MarginRule, value: any) => {
    setEditingMarginRules(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
    setHasUnsavedChanges(true);
  };

  const addMarginRule = () => {
    const newRule: MarginRule = {
      id: Date.now().toString(),
      product: 'Nouveau produit',
      minMargin: 20,
      maxMargin: 50,
      expressMultiplier: 1.2,
    };
    setEditingMarginRules(prev => [...prev, newRule]);
    setHasUnsavedChanges(true);
  };

  const deleteMarginRule = (id: string) => {
    setEditingMarginRules(prev => prev.filter(r => r.id !== id));
    setHasUnsavedChanges(true);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
          <h2 className="text-gray-900">Base de données</h2>
          {hasUnsavedChanges && (
            <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-md text-sm">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs sm:text-sm">Modifications non sauvegardées</span>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetAll} disabled={!hasUnsavedChanges} className="flex-1 sm:flex-none text-sm">
            Annuler
          </Button>
          <Button 
            onClick={saveAll} 
            className="bg-gray-900 hover:bg-gray-800 flex-1 sm:flex-none text-sm"
            disabled={!hasUnsavedChanges}
          >
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </Button>
        </div>
      </div>

      <Tabs defaultValue="papers" className="space-y-4">
        <div className="overflow-x-auto -mx-3 sm:mx-0">
          <TabsList className="bg-white border border-gray-200 inline-flex w-auto min-w-full sm:w-full">
            <TabsTrigger value="papers" className="text-xs sm:text-sm px-3 sm:px-4 whitespace-nowrap">Papiers</TabsTrigger>
            <TabsTrigger value="finishes" className="text-xs sm:text-sm px-3 sm:px-4 whitespace-nowrap">Finitions</TabsTrigger>
            <TabsTrigger value="machines" className="text-xs sm:text-sm px-3 sm:px-4 whitespace-nowrap">Machines</TabsTrigger>
            <TabsTrigger value="labor" className="text-xs sm:text-sm px-3 sm:px-4 whitespace-nowrap">Main d'œuvre</TabsTrigger>
            <TabsTrigger value="margins" className="text-xs sm:text-sm px-3 sm:px-4 whitespace-nowrap">Marges</TabsTrigger>
          </TabsList>
        </div>

        {/* Papers */}
        <TabsContent value="papers">
          <Card className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-900">Papiers</h3>
              <Button onClick={addPaper} size="sm" className="text-xs sm:text-sm">
                <Plus className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Ajouter</span>
                <span className="sm:hidden">+</span>
              </Button>
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px] text-xs sm:text-sm">Nom du papier</TableHead>
                    <TableHead className="min-w-[100px] text-xs sm:text-sm">Grammage (g)</TableHead>
                    <TableHead className="min-w-[100px] text-xs sm:text-sm">Coût (€/kg)</TableHead>
                    <TableHead className="min-w-[120px] text-xs sm:text-sm">Fournisseur</TableHead>
                    <TableHead className="min-w-[120px] text-xs sm:text-sm">Notes</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {editingPapers.map(paper => (
                    <TableRow key={paper.id}>
                      <TableCell>
                        <Input
                          value={paper.name}
                          onChange={(e) => updatePaper(paper.id, 'name', e.target.value)}
                          className="min-w-[100px] text-xs sm:text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={paper.grammage}
                          onChange={(e) => updatePaper(paper.id, 'grammage', parseFloat(e.target.value))}
                          className="min-w-[80px] text-xs sm:text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          value={paper.costPerKg}
                          onChange={(e) => updatePaper(paper.id, 'costPerKg', parseFloat(e.target.value))}
                          className="min-w-[80px] text-xs sm:text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={paper.supplier}
                          onChange={(e) => updatePaper(paper.id, 'supplier', e.target.value)}
                          className="min-w-[100px] text-xs sm:text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={paper.notes}
                          onChange={(e) => updatePaper(paper.id, 'notes', e.target.value)}
                          className="min-w-[100px] text-xs sm:text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deletePaper(paper.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Finishes */}
        <TabsContent value="finishes">
          <Card className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-900">Finitions</h3>
              <Button onClick={addFinish} size="sm" className="text-xs sm:text-sm">
                <Plus className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Ajouter</span>
                <span className="sm:hidden">+</span>
              </Button>
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px] text-xs sm:text-sm">Nom</TableHead>
                    <TableHead className="min-w-[100px] text-xs sm:text-sm">Coût unitaire (€)</TableHead>
                    <TableHead className="min-w-[120px] text-xs sm:text-sm">Temps calage (min)</TableHead>
                    <TableHead className="min-w-[100px] text-xs sm:text-sm">Machine</TableHead>
                    <TableHead className="min-w-[120px] text-xs sm:text-sm">Notes</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {editingFinishes.map(finish => (
                    <TableRow key={finish.id}>
                      <TableCell>
                        <Input
                          value={finish.name}
                          onChange={(e) => updateFinish(finish.id, 'name', e.target.value)}
                          className="min-w-[100px] text-xs sm:text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          value={finish.unitCost}
                          onChange={(e) => updateFinish(finish.id, 'unitCost', parseFloat(e.target.value))}
                          className="min-w-[80px] text-xs sm:text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={finish.setupTime}
                          onChange={(e) => updateFinish(finish.id, 'setupTime', parseFloat(e.target.value))}
                          className="min-w-[80px] text-xs sm:text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={finish.machine}
                          onChange={(e) => updateFinish(finish.id, 'machine', e.target.value)}
                          className="min-w-[80px] text-xs sm:text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={finish.notes}
                          onChange={(e) => updateFinish(finish.id, 'notes', e.target.value)}
                          className="min-w-[100px] text-xs sm:text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteFinish(finish.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Machines */}
        <TabsContent value="machines">
          <Card className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-900">Machines</h3>
              <Button onClick={addMachine} size="sm" className="text-xs sm:text-sm">
                <Plus className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Ajouter</span>
                <span className="sm:hidden">+</span>
              </Button>
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px] text-xs sm:text-sm">Nom</TableHead>
                    <TableHead className="min-w-[100px] text-xs sm:text-sm">Type</TableHead>
                    <TableHead className="min-w-[100px] text-xs sm:text-sm">Coût horaire (€)</TableHead>
                    <TableHead className="min-w-[120px] text-xs sm:text-sm">Cadence (pièces/h)</TableHead>
                    <TableHead className="min-w-[120px] text-xs sm:text-sm">Temps calage (min)</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {editingMachines.map(machine => (
                    <TableRow key={machine.id}>
                      <TableCell>
                        <Input
                          value={machine.name}
                          onChange={(e) => updateMachine(machine.id, 'name', e.target.value)}
                          className="min-w-[100px] text-xs sm:text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <select
                          value={machine.type}
                          onChange={(e) => updateMachine(machine.id, 'type', e.target.value as 'impression' | 'finition')}
                          className="w-full px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm"
                        >
                          <option value="impression">Impression</option>
                          <option value="finition">Finition</option>
                        </select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={machine.hourlyCost}
                          onChange={(e) => updateMachine(machine.id, 'hourlyCost', parseFloat(e.target.value))}
                          className="min-w-[80px] text-xs sm:text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={machine.cadence}
                          onChange={(e) => updateMachine(machine.id, 'cadence', parseFloat(e.target.value))}
                          className="min-w-[100px] text-xs sm:text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={machine.setupTime}
                          onChange={(e) => updateMachine(machine.id, 'setupTime', parseFloat(e.target.value))}
                          className="min-w-[100px] text-xs sm:text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMachine(machine.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Labor */}
        <TabsContent value="labor">
          <Card className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-900">Main d'œuvre</h3>
              <Button onClick={addLabor} size="sm" className="text-xs sm:text-sm">
                <Plus className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Ajouter</span>
                <span className="sm:hidden">+</span>
              </Button>
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px] text-xs sm:text-sm">Type de poste</TableHead>
                    <TableHead className="min-w-[100px] text-xs sm:text-sm">Coût horaire (€)</TableHead>
                    <TableHead className="min-w-[150px] text-xs sm:text-sm">Description</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {editingLabor.map(labor => (
                    <TableRow key={labor.id}>
                      <TableCell>
                        <Input
                          value={labor.position}
                          onChange={(e) => updateLabor(labor.id, 'position', e.target.value)}
                          className="min-w-[100px] text-xs sm:text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={labor.hourlyCost}
                          onChange={(e) => updateLabor(labor.id, 'hourlyCost', parseFloat(e.target.value))}
                          className="min-w-[80px] text-xs sm:text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={labor.description}
                          onChange={(e) => updateLabor(labor.id, 'description', e.target.value)}
                          className="min-w-[120px] text-xs sm:text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteLabor(labor.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Margin Rules */}
        <TabsContent value="margins">
          <Card className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-900">Règles de marge</h3>
              <Button onClick={addMarginRule} size="sm" className="text-xs sm:text-sm">
                <Plus className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Ajouter</span>
                <span className="sm:hidden">+</span>
              </Button>
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px] text-xs sm:text-sm">Produit</TableHead>
                    <TableHead className="min-w-[100px] text-xs sm:text-sm">Marge min (%)</TableHead>
                    <TableHead className="min-w-[100px] text-xs sm:text-sm">Marge max (%)</TableHead>
                    <TableHead className="min-w-[120px] text-xs sm:text-sm">Multiplicateur express</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {editingMarginRules.map(rule => (
                    <TableRow key={rule.id}>
                      <TableCell>
                        <Input
                          value={rule.product}
                          onChange={(e) => updateMarginRule(rule.id, 'product', e.target.value)}
                          className="min-w-[100px] text-xs sm:text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={rule.minMargin}
                          onChange={(e) => updateMarginRule(rule.id, 'minMargin', parseFloat(e.target.value))}
                          className="min-w-[80px] text-xs sm:text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={rule.maxMargin}
                          onChange={(e) => updateMarginRule(rule.id, 'maxMargin', parseFloat(e.target.value))}
                          className="min-w-[80px] text-xs sm:text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          value={rule.expressMultiplier}
                          onChange={(e) => updateMarginRule(rule.id, 'expressMultiplier', parseFloat(e.target.value))}
                          className="min-w-[100px] text-xs sm:text-sm"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteMarginRule(rule.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
