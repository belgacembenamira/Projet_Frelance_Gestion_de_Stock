// src/types/SearchBarProps.tsx
import { ChangeEvent } from "react";

export interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
}
