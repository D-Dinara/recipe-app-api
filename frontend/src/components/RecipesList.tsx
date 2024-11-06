import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Chip, Container, FormControl, Grid2, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import RecipeListItem from "./RecipeListItem";

interface Recipe {
  id: number;
  title: string;
  description: string;
  time_minutes: number;
  price: number;
  image: string;
  tags: Tag[];
}

interface Tag {
  name: string;
}

const API_BASE_URL = 'http://localhost:8000/api/recipe';

const RecipesList = () => {
  const token = localStorage.getItem('authToken');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeInMinutes, setTimeInMinutes] = useState(0);
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState<Tag>({ name: '' });

  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await fetch(`${API_BASE_URL}/recipes/`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      const data = await response.json();
      setRecipes(data);
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    const fetchTags = async () => {
      const response = await fetch(`${API_BASE_URL}/tags/`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      const data = await response.json();
      setTags(data);
    };

    fetchTags();
  }, []);

  const handleCreateRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    const recipe = {
      title,
      description,
      time_minutes: timeInMinutes,
      price,
      tags: selectedTags,
      image: image || undefined,
    };
    const response = await fetch(`${API_BASE_URL}/recipes/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`,
      },
      body: JSON.stringify(recipe),
    });
    const data = await response.json();
    setRecipes([...recipes, data]);
  };

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tags.some((tag) => tag.name === newTag.name)) {
      alert('Tag already exists');
    } else {
      setTags([...tags, newTag]);
    }
    setNewTag({ name: '' });
  };

  console.log('recipes', recipes);

  return (
    <Container>
      <Box display="flex" flexDirection="column" alignItems="center">
        {/* Form to add new recipe */}
        <Accordion sx={{margin: '15px 0'}}>
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Typography>Add a new recipe</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Recipe Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                variant="outlined"
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <TextField
                label="Time in Minutes"
                type="number"
                value={timeInMinutes}
                onChange={(e) => setTimeInMinutes(parseInt(e.target.value))}
                variant="outlined"
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <TextField
                label="Price"
                type="number"
                value={price}
                onChange={(e) => setPrice(parseInt(e.target.value))}
                variant="outlined"
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <TextField
                label="Image URL"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                variant="outlined"
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <TextField
                label="Recipe Description"
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                variant="outlined"
              />
            </FormControl>

            <Box display="flex" flexDirection="column" margin="normal">
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {tags.map((tag) => (
                <Chip
                  key={tag.name}
                  label={tag.name}
                  clickable
                  color={selectedTags.some((t) => t.name === tag.name) ? 'primary' : 'default'}
                  onClick={() => {
                    if (selectedTags.some((t) => t.name === tag.name)) {
                      setSelectedTags(selectedTags.filter((t) => t.name !== tag.name));
                    } else {
                      setSelectedTags([...selectedTags, { name: tag.name }]);
                    }
                  }}
                />
              ))}
            </Box>
              {/* Form to add a new tag */}
              <Box display="flex" gap={2} alignItems={'center'}>
                <FormControl margin="normal">
                  <TextField
                    label="New Tag"
                    value={newTag.name}
                    onChange={(e) => setNewTag({ name: e.target.value })}
                    variant="outlined"
                    size="small"
                  />
                </FormControl>

                <Button size="small" style={{ whiteSpace: 'nowrap' }} type="submit" variant="contained" onClick={handleCreateTag}>
                  Add Tag
                </Button>
              </Box>
            </Box>
            <Button type="submit" variant="contained" color="primary" onClick={handleCreateRecipe}>
              Add Recipe
            </Button>
          </AccordionDetails>
        </Accordion>
        <Typography variant="h4" gutterBottom>
          Recipes
        </Typography>
        <Grid2 container spacing={2} margin={2}>
          {recipes.map((recipe) => (
            <RecipeListItem key={recipe.id} recipe={recipe} />
          ))}
        </Grid2>
      </Box>
    </Container>
  );
};

export default RecipesList;
