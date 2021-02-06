import React, { useContext } from "react";
import PosContext from "../../context/PosContext";
import SearchBar from "material-ui-search-bar";
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';



function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'id', numeric: false, disablePadding: false, label: 'Id' },
  { id: 'item_name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'item_price', numeric: true, disablePadding: false, label: 'Price' },
  { id: 'item_quantity', numeric: true, disablePadding: false, label: 'Quantity' },
  { id: 'upc_no', numeric: true, disablePadding: false, label: 'UPC' },
  { id: 'city_tax', numeric: true, disablePadding: false, label: 'City tax' },
  { id: 'state_tax', numeric: true, disablePadding: false, label: 'State tax ' },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;
  const [searchWord, setSearchWord]= React.useState('');
  const { setFilteredProducts, products}= useContext(PosContext);
  
  if(searchWord=== ''){
  	setFilteredProducts(products);
  }
  const doFilterWith = ()=> {
  	setFilteredProducts(products.filter(product => String(product.upc_no).indexOf(String(searchWord))!==-1 ));
  }

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          Grocery
        </Typography>
      )}

      <SearchBar
      	value= {searchWord}
	    onChange={(newValue) => setSearchWord( newValue )}
	    onRequestSearch={() => doFilterWith()}
	  />
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};



const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function EnhancedTable() {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  // const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const {filteredProducts, selledProducts, setSelledProducts, foodStamp}= useContext(PosContext);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

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

  const handleClick = (event, filteredProduct) => {
  	let tmp2= [...selledProducts]
  	let tmp1= {...filteredProduct}
  	console.log(foodStamp)
  	if(foodStamp){
  		tmp1.city_tax= 0;
  		tmp1.state_tax= 0;
  	}
    // selledProducts.push(filteredProduct);
    let exist= false;
    let newSelledProducts= [];
    tmp2.forEach(function(item, index, array){
    	if(object_equals(item.id, tmp1)){
    		exist= true;
    		item.count++;
    		newSelledProducts= [...selledProducts]
    	}
    })
    if(!exist){
    	let tmp= {id: tmp1, count: 1};
    	newSelledProducts = [...selledProducts, tmp]
    }
    
    setSelledProducts(newSelledProducts);
    // let newSelected = [];
    // if (selectedIndex === -1) {
    //   newSelected = newSelected.concat(selected, name);
    // } else if (selectedIndex === 0) {
    //   newSelected = newSelected.concat(selected.slice(1));
    // } else if (selectedIndex === selected.length - 1) {
    //   newSelected = newSelected.concat(selected.slice(0, -1));
    // } else if (selectedIndex > 0) {
    //   newSelected = newSelected.concat(
    //     selected.slice(0, selectedIndex),
    //     selected.slice(selectedIndex + 1),
    //   );
    // }

    // setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, filteredProducts.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={filteredProducts.length}
            />
            <TableBody>
              {stableSort(filteredProducts, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((filteredProduct, index) => {

                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, filteredProduct)}
                      role="checkbox"
                      tabIndex={-1}
                      key={filteredProduct.id}
                    >
                      <TableCell p={1}>
                        {filteredProduct.id}
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="filteredProduct" padding="none">
                        {filteredProduct.item_name}
                      </TableCell>
                      <TableCell align="right">{filteredProduct.item_price.toFixed(2)}</TableCell>
                      <TableCell align="right">{filteredProduct.item_quantity}</TableCell>
                      <TableCell align="right">{filteredProduct.upc_no}</TableCell>
                      <TableCell align="right">{filteredProduct.city_tax}</TableCell>
                      <TableCell align="right">{filteredProduct.state_tax}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </div>
  );
}
