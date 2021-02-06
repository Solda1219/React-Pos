import React, { useContext } from "react";
import PosContext from "../../context/PosContext";
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';


import {
  Grid
} from '@material-ui/core'

export default function PosPrice(){
  const {selledProducts, setSelledProducts, foodStamp, setFoodStamp}= useContext(PosContext);
  let totalPrice= 0
  selledProducts.forEach(function(item, index){
  	totalPrice= totalPrice+ (item.id.item_price.toFixed(2) *item.count+ (item.id.item_price *item.count* (item.id.city_tax*10.4+item.id.state_tax)/100));
  })

  function object_equals( x, y ) {
	  if ( x === y ) return true;
	    // if both x and y are null or undefined and exactly the same

	  if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) return false;
	    // if they are not strictly equal, they both need to be Objects

	  if ( x.constructor !== y.constructor ) return false;
	    // they must have the exact same prototype chain, the closest we can do is
	    // test there constructor.

	  for ( var p in x ) {
	    if ( ! x.hasOwnProperty( p ) ) continue;
	      // other properties were tested using x.constructor === y.constructor

	    if ( ! y.hasOwnProperty( p ) ) return false;
	      // allows to compare x[ p ] and y[ p ] when set to undefined

	    if ( x[ p ] === y[ p ] ) continue;
	      // if they have the same strict value or identity then they are equal

	    if ( typeof( x[ p ] ) !== "object" ) return false;
	      // Numbers, Strings, Functions, Booleans must be strictly equal

	    if ( ! object_equals( x[ p ],  y[ p ] ) ) return false;
	      // Objects and Arrays must be tested recursively
	  }

	  for ( p in y )
	    if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) )
	      return false;
	        // allows x[ p ] to be set to undefined

	  return true;
	}
  const handleStamp = (event) => {
  	if (foodStamp){
  		setFoodStamp(false);
  	}
  	else{
  		setFoodStamp(true);
  	}
  }

  const clearAll = (event) => {
  	alert("Your total earn is "+ totalPrice.toFixed(2) + "$ today!");
  	setSelledProducts([]);
  	setFoodStamp(false);
  }


  const handleClick = (event, deletedProduct) => {
  	let tmpSell= [...selledProducts]
  	let tmp= {...deletedProduct}
  	let newSelled= []
  	
  	if(tmp.count > 1){
  		tmpSell.forEach((item)=>{
  			if(object_equals(item, tmp))
  				item.count--;
  		})
  		newSelled= [...tmpSell]
  	}
  	else if(tmp.count===1){
  		let tmp1= tmpSell.filter(item=>
	  		!object_equals(item, tmp)
  		);
  		newSelled= [...tmp1]
  	}
  	setSelledProducts(newSelled);
  	
  }
  return(
  	<Grid container direction= "column">
  		<Grid item xs= {12} sm= {12}>
		  	<ul style={{overflowY: 'scroll', overflowX: 'scroll', marginTop: '0px', height: '500px', border: '1px solid black' }}>

		    {selledProducts.map((item, index) => (
				<li
				key={index}
				
				>
					<Grid container style={{marginTop: '20px', paddingBottom: '10px', paddingLeft: '15px', borderBottom: '1px solid grey'}} onClick={(event) => handleClick(event, item)}>
			      		<Grid item xs={12} sm={12} style= {{paddingBottom: '10px', fontSize: '20px'}}>
			      			{item.id.item_name}
			      		</Grid>
			      		<Grid item xs={4} sm= {4}>
			      			{item.id.item_price.toFixed(2)}$ X {item.count}
			      		</Grid>
			      		<Grid item xs={3} sm= {3}>
			      			<b>Vat:</b> {item.id.city_tax*10.4+item.id.state_tax}%
			      		</Grid>
			      		<Grid item xs={4} sm= {4}>
			      			<b>TP:</b> {(item.id.item_price.toFixed(2) *item.count+ (item.id.item_price *item.count* (item.id.city_tax*10.4+item.id.state_tax)/100)).toFixed(2)}$
			      		</Grid>
			      		<Grid item xs={1} sm= {1}>
			      			<DeleteOutlinedIcon />
			      		</Grid>
		      		</Grid>
				</li>
				)
			)}
		  	</ul>
		</Grid>
		<Grid item xs= {12} sm= {12}>
			<Grid container alignItems="center" justify="center" style= {{borderBottom: '1px dashed grey', marginTop: '20px', paddingBottom: '10px'}}>
				<Grid item xs= {6} sm= {6} align= "center" style= {{fontSize: "20px"}}>
					<b>Total:</b>
				</Grid>
				<Grid item xs= {6} sm= {6} align= "center">
					{totalPrice.toFixed(2)}$
				</Grid>
			</Grid>
		</Grid>
		<Grid item xs= {12} sm= {12}>
			<Grid container alignItems="center" justify="center" style= {{marginTop: '20px', paddingBottom: '10px'}}>
				<Grid item xs= {6} sm= {6} align= "center">
					<FormControlLabel
				        control={
				          <Checkbox
				          	checked= {foodStamp}
				          	onChange= {handleStamp}
				            name="checkedB"
				            color="primary"
				          />
				        }
				        label="FoodStamp"
				     />
				</Grid>
				<Grid item xs= {6} sm= {6} align= "center">
					<Button variant="contained" color="primary" onClick= {clearAll}>
				        Valid
				    </Button>
				</Grid>
			</Grid>
		</Grid>
	</Grid>
	)
};
