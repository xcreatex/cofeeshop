import { Coffee, List, FileText } from "lucide-react"
import SqlQueryButton from "./SqlQueryButton"

const FeaturedRecipe = ({ data }) => {
  // SQL query for featured recipe
  const sqlQuery = `SELECT 
    r.name,
    r.instructions,
    r.image_url,
    GROUP_CONCAT(
        CONCAT(ri.quantity, ' ', ri.unit, ' ', i.name)
        ORDER BY ri.display_order
        SEPARATOR '|'
    ) as ingredients
FROM 
    recipes r
JOIN 
    recipe_ingredients ri ON r.id = ri.recipe_id
JOIN 
    ingredients i ON ri.ingredient_id = i.id
WHERE 
    r.is_featured = 1
    AND r.active = 1
GROUP BY 
    r.id
LIMIT 1;`

  return (
    <div className="fade-in">
      <h2 className="section-title">
        <Coffee size={24} />
        Featured Coffee Recipe
      </h2>

      <div className="card p-0 overflow-hidden">
        <div className="h-[150px] bg-cover bg-center relative" style={{ backgroundImage: `url(${data.image})` }}>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white flex justify-between items-end">
            <h3 className="text-xl font-semibold mb-1">{data.name}</h3>
            <SqlQueryButton query={sqlQuery} title="Featured Recipe Query" />
          </div>
        </div>

        <div className="p-4">
          <div className="mb-4">
            <h4 className="text-base font-semibold text-coffee-dark mb-2 flex items-center gap-1">
              <List size={16} />
              Ingredients
            </h4>
            <ul className="pl-5 text-sm">
              {data.ingredients.map((ingredient, index) => (
                <li key={index} className="mb-1">
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-base font-semibold text-coffee-dark mb-2 flex items-center gap-1">
              <FileText size={16} />
              Instructions
            </h4>
            <p className="text-sm leading-relaxed">{data.instructions}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeaturedRecipe

