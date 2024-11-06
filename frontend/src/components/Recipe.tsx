import { Alert, Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
const RecipePage = () => {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [deleted, setDeleted] = useState(false);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchRecipe = async () => {
      const response = await fetch(`http://localhost:8000/api/recipe/recipes/${recipeId}/`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      const data = await response.json();
      setRecipe(data);
    };
    fetchRecipe();
  }, []);

  const handleDelete = async () => {
    const response = await fetch(`http://localhost:8000/api/recipe/recipes/${recipeId}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`,
      },
    });
    if (response.ok) {
      setDeleted(true);
    }
  }

  return (
    <>
      {deleted ?
        <>
          <Alert severity="success">Recipe deleted</Alert>
          <Button
            variant="contained"
            color="primary"
            href="/"
          >Return to recipes</Button>
        </> :
        <Box display={'flex'} flexDirection={'column'} alignItems={'center'}>
          <Typography variant="h3">Recipe title: {recipe?.title}</Typography>
          <Typography variant="body1">Description: {recipe?.description}</Typography>
          {/* Delete recipe */}
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
          >
            Delete recipe
          </Button>
        </Box>
      }
    </>
  );
}

export default RecipePage;