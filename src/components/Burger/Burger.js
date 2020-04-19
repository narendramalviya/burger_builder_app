import React from 'react';
import BurgerIngredient from './BugerIngredient/BurgerIngredient';
import classes from './Burger.css';


const burger = (props) => {
    //take object keys as array of string keys
    //map to the array ingredient keys 
    //make empty array size of ingrendient object values
    //maping on that empty array to <BurgerIngredient >
    let tranformedIngredient = Object.keys(props.ingredients)
        .map(igKey => {
            return [...Array(props.ingredients[igKey])].map((_, i) => {
                return <BurgerIngredient key={igKey + i} type={igKey} />;
            });
        }).reduce((arr, ele) => arr.concat(ele));

    // console.log(tranformedIngredient);

    if(tranformedIngredient.length === 0){
        tranformedIngredient = <p>Please start adding ingredients!!</p>;
    }

    return (

        <div className={classes.Burger}>
            <BurgerIngredient type='bread-top' />
               {tranformedIngredient}
            <BurgerIngredient type='bread-bottom' />
        </div>

    );
};

export default burger;