import React, { useState } from "react";
import { TextField, Button, Grid, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";

interface SearchProps {
  onSearch: (searchTerm: string, searchLocation: string) => void;
  defaultSearchTerm?: string;
  defaultSearchLocation?: string;
}

const SearchBar: React.FC<SearchProps> = ({
  onSearch,
  defaultSearchTerm = "",
  defaultSearchLocation = "",
}) => {
  const [searchTerm, setSearchTerm] = useState(defaultSearchTerm);
  const [searchLocation, setSearchLocation] = useState(defaultSearchLocation);

  const handleSearch = () => {
    onSearch(searchTerm, searchLocation);
  };

  return (
    <Grid container spacing={10}>
      <Grid item xs={12} sm={5} md={5}>
        <TextField
          fullWidth
          placeholder="title, company, skills, or job type"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#4F46E5" }} />
              </InputAdornment>
            ),
          }}
          size="medium"
        />
      </Grid>
      <Grid item xs={12} sm={4} md={4}>
        <TextField
          fullWidth
          placeholder="Location"
          variant="outlined"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LocationOnIcon sx={{ color: "#4F46E5" }} />
              </InputAdornment>
            ),
          }}
          size="medium"
        />
      </Grid>
      <Grid item xs={12} sm={3} md={3}>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          sx={{
            height: 54,
            borderRadius: 2,
            fontSize: "1rem",
            fontWeight: 600,
          }}
          onClick={handleSearch}
          endIcon={<SearchIcon />}
        >
          Search Jobs
        </Button>
      </Grid>
    </Grid>
  );
};

export default SearchBar;
