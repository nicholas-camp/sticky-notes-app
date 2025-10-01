export type Note = {
    id: number;
    body: string;
    colors: { 
      id: string; 
      colorHeader: string; 
      colorBody: string; 
      colorText: string; 
    };
    position: { 
      x: number; 
      y: number; 
    };
};
  