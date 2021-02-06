import React, { useState, useEffect } from "react";
import PosProduct from "./PosProduct";
import PosPrice from "./PosPrice";
import PosContext from "../../context/PosContext";
import Axios from "axios";

import {
  Grid
} from '@material-ui/core'

export default function PosContainer() {
	const [products, setProducts] = useState(
		[]
		);
	const [selledProducts, setSelledProducts] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState(products);
	const [foodStamp, setFoodStamp]= useState(false);
	useEffect(() => {
	    const getAllProducts = async () => {
	      	const productsRes = await Axios.get(
	        	"http://localhost:5000/getAllProducts"
	      	);
	      	if (productsRes.data) {
	        	setProducts(productsRes.data)
	        	setFilteredProducts(productsRes.data)
	    	};

	    }
	    getAllProducts();
  	}, []);
	return (
		<PosContext.Provider value= {{products, setProducts, selledProducts, setSelledProducts, filteredProducts, setFilteredProducts, foodStamp, setFoodStamp}}>
	      	<Grid container spacing={1} style={{marginTop: '38px'}}>
	      		<Grid item xs={8} sm={8}>
	      			<PosProduct/>
	      		</Grid>
	      		<Grid item xs={4} sm= {4}>
	      			<PosPrice/>
	      		</Grid>
	      	</Grid>
		</PosContext.Provider>
	);
}