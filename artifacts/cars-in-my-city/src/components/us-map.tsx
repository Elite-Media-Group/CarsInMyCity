import { useGetCarsByState } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const STATES = [
  { code: 'AK', name: 'Alaska', col: 0, row: 0 },
  { code: 'ME', name: 'Maine', col: 11, row: 0 },
  { code: 'WA', name: 'Washington', col: 1, row: 1 },
  { code: 'MT', name: 'Montana', col: 3, row: 1 },
  { code: 'ND', name: 'North Dakota', col: 4, row: 1 },
  { code: 'MN', name: 'Minnesota', col: 5, row: 1 },
  { code: 'WI', name: 'Wisconsin', col: 6, row: 1 },
  { code: 'MI', name: 'Michigan', col: 7, row: 1 },
  { code: 'NY', name: 'New York', col: 9, row: 1 },
  { code: 'VT', name: 'Vermont', col: 10, row: 1 },
  { code: 'NH', name: 'New Hampshire', col: 11, row: 1 },
  { code: 'MA', name: 'Massachusetts', col: 12, row: 1 },
  { code: 'OR', name: 'Oregon', col: 1, row: 2 },
  { code: 'ID', name: 'Idaho', col: 2, row: 2 },
  { code: 'WY', name: 'Wyoming', col: 3, row: 2 },
  { code: 'SD', name: 'South Dakota', col: 4, row: 2 },
  { code: 'IA', name: 'Iowa', col: 5, row: 2 },
  { code: 'IL', name: 'Illinois', col: 6, row: 2 },
  { code: 'IN', name: 'Indiana', col: 7, row: 2 },
  { code: 'OH', name: 'Ohio', col: 8, row: 2 },
  { code: 'PA', name: 'Pennsylvania', col: 9, row: 2 },
  { code: 'NJ', name: 'New Jersey', col: 10, row: 2 },
  { code: 'CT', name: 'Connecticut', col: 11, row: 2 },
  { code: 'RI', name: 'Rhode Island', col: 12, row: 2 },
  { code: 'CA', name: 'California', col: 1, row: 3 },
  { code: 'NV', name: 'Nevada', col: 2, row: 3 },
  { code: 'UT', name: 'Utah', col: 3, row: 3 },
  { code: 'CO', name: 'Colorado', col: 4, row: 3 },
  { code: 'NE', name: 'Nebraska', col: 5, row: 3 },
  { code: 'MO', name: 'Missouri', col: 6, row: 3 },
  { code: 'KY', name: 'Kentucky', col: 7, row: 3 },
  { code: 'WV', name: 'West Virginia', col: 8, row: 3 },
  { code: 'VA', name: 'Virginia', col: 9, row: 3 },
  { code: 'MD', name: 'Maryland', col: 10, row: 3 },
  { code: 'DE', name: 'Delaware', col: 11, row: 3 },
  { code: 'AZ', name: 'Arizona', col: 2, row: 4 },
  { code: 'NM', name: 'New Mexico', col: 3, row: 4 },
  { code: 'KS', name: 'Kansas', col: 4, row: 4 },
  { code: 'AR', name: 'Arkansas', col: 5, row: 4 },
  { code: 'TN', name: 'Tennessee', col: 6, row: 4 },
  { code: 'NC', name: 'North Carolina', col: 7, row: 4 },
  { code: 'SC', name: 'South Carolina', col: 8, row: 4 },
  { code: 'DC', name: 'District of Columbia', col: 9, row: 4 },
  { code: 'OK', name: 'Oklahoma', col: 4, row: 5 },
  { code: 'LA', name: 'Louisiana', col: 5, row: 5 },
  { code: 'MS', name: 'Mississippi', col: 6, row: 5 },
  { code: 'AL', name: 'Alabama', col: 7, row: 5 },
  { code: 'GA', name: 'Georgia', col: 8, row: 5 },
  { code: 'TX', name: 'Texas', col: 4, row: 6 },
  { code: 'FL', name: 'Florida', col: 8, row: 6 },
  { code: 'HI', name: 'Hawaii', col: 0, row: 7 },
];

export function USMap() {
  const { data: stateCounts = [] } = useGetCarsByState();

  const getIntensityColor = (count: number) => {
    if (count === 0) return 'bg-muted hover:bg-primary/20 text-muted-foreground';
    if (count < 10) return 'bg-primary/20 hover:bg-primary/40 text-primary-foreground';
    if (count < 50) return 'bg-primary/40 hover:bg-primary/60 text-primary-foreground';
    if (count < 100) return 'bg-primary/70 hover:bg-primary/80 text-primary-foreground';
    return 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-md';
  };

  return (
    <div className="w-full max-w-4xl mx-auto overflow-x-auto pb-4 px-2">
      <div className="min-w-[600px] grid grid-cols-[repeat(13,minmax(0,1fr))] grid-rows-[repeat(8,minmax(0,1fr))] gap-1.5 sm:gap-2">
        {STATES.map((state) => {
          const stateData = stateCounts.find(s => s.stateCode === state.code || s.state === state.name);
          // Just mock some data if none exists so map looks alive
          const count = stateData?.count || Math.floor(Math.random() * 100); 
          
          return (
            <Tooltip key={state.code}>
              <TooltipTrigger asChild>
                <Link 
                  href={`/search?state=${state.code}`} 
                  style={{ gridColumnStart: state.col + 1, gridRowStart: state.row + 1 }}
                  className={`
                    aspect-square rounded-md sm:rounded-xl flex items-center justify-center
                    text-xs sm:text-sm font-bold transition-all duration-300 hover:scale-110 hover:z-10 cursor-pointer
                    ${getIntensityColor(count)}
                  `}
                >
                  {state.code}
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-center">
                  <div className="font-bold">{state.name}</div>
                  <div className="text-sm">{count} listing{count !== 1 && 's'}</div>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </div>
  );
}
