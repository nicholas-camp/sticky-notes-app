export interface Colors {
    id: string;
    colorHeader: string;
    colorBody: string;
    colorText: string;
  }
  
  export interface Position {
    x: number;
    y: number;
  }
  
  export interface Note {
    id: number;
    body: string;
    colors: Colors;
    position: Position;
  }
  