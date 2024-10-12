import React, { ChangeEvent } from 'react';
import { TextField, Box } from '@mui/material';

interface SearchFiltersProps {
    searchName: string;
    setSearchName: (name: string) => void;
    searchDate: string;
    setSearchDate: (date: string) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ searchName, setSearchName, searchDate, setSearchDate }) => {
    // Handle search name change
    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchName(event.target.value);
    };

    // Handle search date change
    const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchDate(event.target.value);
    };

    return (
        <Box p={2} display="flex" flexDirection="column" gap={2} sx={{ borderRadius: 2, boxShadow: 1 }}>
            <TextField
                label="Search by Client Name"
                variant="outlined"
                value={searchName}
                onChange={handleNameChange}
                sx={{ backgroundColor: 'white' }} // Optional: improves readability
            />
            {/* <TextField
                label="Search by Date"
                type="date"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={searchDate}
                onChange={handleDateChange}
                sx={{ backgroundColor: 'white' }} // Optional: improves readability
            /> */}
        </Box>
    );
};

export default SearchFilters;
