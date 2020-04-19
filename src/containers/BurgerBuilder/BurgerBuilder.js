import React, { Component } from "react";
import Burger from '../../components/Burger/Burger';
import Aux from "../../hoc/Aux/Aux";
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios-orders';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
}

class BurgerBuilder extends Component {
  state = {
    ingredients: null, //fetch ingredients from firebase
    totalPrice: 4,  //total price of burger and have base price 4
    purchaseble: false, //state for order button
    purchasing: false,  //state for modal handling
    loading: false,  //state for Sppiner loading
    error:false
  };

  componentDidMount() {
    axios.get('https://react-burger-builder-9d9c9.firebaseio.com//ingredients.json').then(response => {
      //  console.log(response.data);
      this.setState({ ingredients: response.data });

    }).catch(error =>{
         this.setState({error:true});
    });
  }
  //upDating purchaseble state, checking atleast one ingredients add or not
  updatePurchaseState(ingredients) {

    const sum = Object.keys(ingredients)
      .map(igKey => ingredients[ igKey ])
      .reduce((sum, ele) => { return sum + ele }, 0);

    //updating state
    this.setState({
      purchaseble: sum > 0
    })
  }

  //add ingredintHandler function 
  addIngredientHandler = (type) => {
    const oldIngredients = { ...this.state.ingredients };
    const updatedIngredients = { ...oldIngredients };
    updatedIngredients[ type ] = oldIngredients[ type ] + 1;

    //updating prices
    const oldPrice = this.state.totalPrice;
    // console.log(oldPrice);
    const updatedPrice = oldPrice + INGREDIENT_PRICES[ type ];

    // console.log(updatedIngredients);
    // console.log(updatedPrice);

    //updating state
    this.setState({
      totalPrice: updatedPrice,
      ingredients: updatedIngredients
    })
    this.updatePurchaseState(updatedIngredients);
  }

  //add removeIngredientHandler function 
  removeIngredientHandler = (type) => {
    const oldIngredients = { ...this.state.ingredients };
    const updatedIngredients = { ...oldIngredients };
    updatedIngredients[ type ] = oldIngredients[ type ] - 1;

    //updating prices
    const oldPrice = this.state.totalPrice;
    const updatedPrice = oldPrice - INGREDIENT_PRICES[ type ];


    //updating state
    this.setState({
      totalPrice: updatedPrice,
      ingredients: updatedIngredients
    })
    this.updatePurchaseState(updatedIngredients);
  }

  //updating purchasing state
  //function trigger via checkout button in buildControls
  purchasingHanlder = () => {
    this.setState({ purchasing: true });
  }

  //updating state when clicking on Modal backdrop  
  purchaseCancleHanlder = () => {
    this.setState({ purchasing: false });
  }
  purchaseContinueHanlder = () => {
    // alert('You Continued!');
    this.setState({ loading: true });

    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
      customer: {
        name: 'Narendra Malviya',
        address: {
          street: 'Teststreet 1',
          zipCode: '43453',
          country: 'india'
        },
        email: 'test@test.com'
      },
      deliveryMethod: 'fastest'
    }

    axios.post('/orders.json', order).then((response) => {
      this.setState({ loading: false, purchasing: false });
    }).catch((error) => {
      this.setState({ loading: false, purchasing: false });
      // alert(error);
    })

  }


  render() {

    const disabledInfo = {
      ...this.state.ingredients
    }

    for (let key in disabledInfo) {
      disabledInfo[ key ] = disabledInfo[ key ] <= 0;
    }

    let orderSummary = null;
    let burger = this.state.error ? <p>Ingredients can't be loaded</p>:<Spinner /> ;
    if (this.state.ingredients) {
      burger =
        <Aux>
          <Burger ingredients={this.state.ingredients} />
          <BuildControls
            addIngredientHandler={this.addIngredientHandler}
            removeIngredientHandler={this.removeIngredientHandler}
            disabledInfo={disabledInfo}
            price={this.state.totalPrice}
            purchaseState={this.state.purchaseble} //passing state for order button for button disable or not
            ordered={this.purchasingHanlder} //method for updating state for modal view
          />
        </Aux>

       orderSummary = <OrderSummary ingredients={this.state.ingredients}
        purchaseCancelled={this.purchaseCancleHanlder}
        purchaseContinued={this.purchaseContinueHanlder}
        price={this.state.totalPrice}
      />

      if (this.state.loading) {
        orderSummary = <Spinner />;
      }
    }

    return (

      <Aux>
        <Modal show={this.state.purchasing} modalClosed={this.purchaseCancleHanlder}>
          {orderSummary}
        </Modal>

        {burger}
      </Aux>
    );
  }
}
export default withErrorHandler(BurgerBuilder, axios);
