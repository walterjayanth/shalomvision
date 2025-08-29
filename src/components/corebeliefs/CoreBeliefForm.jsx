import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

export default function CoreBeliefForm({ belief, onSave, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    title: '',
    scripture_reference: '',
    statement: '',
    display_order: 1,
  });

  useEffect(() => {
    if (belief) {
      setFormData(belief);
    } else {
      setFormData({ title: '', scripture_reference: '', statement: '', display_order: 1 });
    }
  }, [belief]);

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value, 10) : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Belief Title *</Label>
        <Input id="title" value={formData.title} onChange={handleChange('title')} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="scripture_reference">Scripture Reference</Label>
        <Input id="scripture_reference" value={formData.scripture_reference || ''} onChange={handleChange('scripture_reference')} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="statement">Statement *</Label>
        <Textarea id="statement" value={formData.statement} onChange={handleChange('statement')} required rows={10} />
      </div>
       <div className="space-y-2">
        <Label htmlFor="display_order">Display Order</Label>
        <Input id="display_order" type="number" value={formData.display_order} onChange={handleChange('display_order')} required />
      </div>
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          Save Statement
        </Button>
      </div>
    </form>
  );
}