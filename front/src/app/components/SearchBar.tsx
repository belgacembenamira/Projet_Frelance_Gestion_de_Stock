import React, { ChangeEvent, useState, useMemo, useCallback } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { SearchBarProps } from "../types/SearchBarProps";
import { debounce } from "lodash";

// Debounced function to avoid performance issues during input changes
const useDebouncedSearch = (callback: (value: string) => void, delay: number) => {
  return useMemo(() => debounce(callback, delay), [callback, delay]);
};

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearchChange }) => {
  const [query, setQuery] = useState(searchQuery);

  // Create a debounced search function with a 300ms delay
  const debouncedSearch = useDebouncedSearch((value: string) => {
    onSearchChange({ target: { value } } as ChangeEvent<HTMLInputElement>);
  }, 300);

  // Handle input change
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;
    setQuery(newQuery);
    debouncedSearch(newQuery);
  };

  // Clear the search input
  const handleClear = () => {
    setQuery("");
    onSearchChange({ target: { value: "" } } as ChangeEvent<HTMLInputElement>);
  };

  return (
    <TextField
      label="Search"
      fullWidth
      variant="outlined" // Added variant for better styling
      value={query}
      onChange={handleInputChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {query && (
              <IconButton onClick={handleClear} edge="end" aria-label="Clear search">
                <ClearIcon />
              </IconButton>
            )}
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      sx={{ marginBottom: "1rem", borderRadius: "8px" }} // Improved styling with sx prop
    />
  );
};

export default SearchBar;
