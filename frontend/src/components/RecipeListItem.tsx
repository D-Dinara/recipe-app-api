import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { Box, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface Tag {
  name: string;
}

interface Recipe {
  id: number;
  title: string;
  description: string;
  time_minutes: number;
  price: number;
  image: string;
  tags: Tag[];
}

const RecipeListItem = ({ recipe }: { recipe: Recipe}) => {
  const navigate = useNavigate();

  const handleRecipeClick = () => {
    console.log('recipe clicked', recipe);
    navigate(`/recipes/${recipe.id}`);
  };

  return (
    <Card raised sx={{ maxWidth: 345, minWidth: 250  }}>
      <CardActionArea onClick={handleRecipeClick}>
        <CardMedia
          component="img"
          image={recipe.image}
          height={180}
          alt={recipe.title}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {recipe.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {recipe.time_minutes} minutes
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            ${recipe.price}
          </Typography>
          <Box>
            {recipe.tags.map((tag) => (
              <Chip key={tag.name} label={tag.name} />
            ))}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default RecipeListItem;
