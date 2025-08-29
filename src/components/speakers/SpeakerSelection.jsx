import React, { useState, useEffect } from 'react';
import { SpeakerProfile } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Check, ChevronsUpDown, User, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SpeakerSelection({ value = [], onChange }) {
  const [open, setOpen] = useState(false);
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpeakers = async () => {
      setLoading(true);
      try {
        const speakerData = await SpeakerProfile.list();
        setSpeakers(speakerData);
      } catch (error) {
        console.error("Failed to fetch speakers:", error);
      }
      setLoading(false);
    };
    fetchSpeakers();
  }, []);

  const selectedSpeakers = speakers.filter(s => value.includes(s.id));

  const handleSelect = (speakerId) => {
    const isSelected = value.includes(speakerId);
    if (isSelected) {
      onChange(value.filter(id => id !== speakerId));
    } else {
      onChange([...value, speakerId]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto"
          disabled={loading}
        >
          <div className="flex flex-wrap gap-1">
            {loading ? 'Loading speakers...' : (
              selectedSpeakers.length > 0 ? (
                selectedSpeakers.map(speaker => (
                  <Badge key={speaker.id} variant="secondary" className="flex items-center gap-1">
                    <img src={speaker.profile_image} alt={speaker.name} className="w-4 h-4 rounded-full object-cover" />
                    {speaker.name}
                  </Badge>
                ))
              ) : (
                <span className="text-slate-500">Select speakers...</span>
              )
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search speakers..." />
          <CommandList>
            <CommandEmpty>No speaker found.</CommandEmpty>
            <CommandGroup>
              {speakers.map((speaker) => (
                <CommandItem
                  key={speaker.id}
                  value={speaker.name}
                  onSelect={() => handleSelect(speaker.id)}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(speaker.id) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex items-center gap-3">
                    <img src={speaker.profile_image} alt={speaker.name} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <p className="font-medium">{speaker.name}</p>
                      <p className="text-xs text-slate-500">{speaker.title}</p>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}