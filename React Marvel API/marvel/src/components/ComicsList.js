import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Routes, Link, Route, useParams } from 'react-router-dom';
import SearchShows from './ComicsSearch';
import 
{ Card,
 CardActionArea, 
 CardContent, 
 CardMedia, 
 Grid, 
 Typography, 
 Button,
 makeStyles} from '@material-ui/core';
import '../App.css';

const useStyles = makeStyles({
	card: {
		maxWidth: 250,
		height: 'auto',
		marginLeft: 'auto',
		marginRight: 'auto',
		borderRadius: 5,
		border: '1px solid #1e8678',
		boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
	},
	titleHead: {
		borderBottom: '1px solid #1e8678',
		fontWeight: 'bold'
	},
	grid: {
		flexGrow: 1,
		flexDirection: 'row'
	},
	media: {
		height: '100%',
		width: '100%'
	},
	button: {
		color: '#1e8678',
		fontWeight: 'bold',
		fontSize: 12
	}
});

const md5 = require('blueimp-md5');
const publickey = '225da753373af06439f2707bae90051d';
const privatekey = 'de460172ba9f3af8774c537de0c43750a370661e';
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = 'https://gateway.marvel.com:443/v1/public/comics';
const url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;

const CharactersList = () => {

	const regex = /(<([^>]+)>)/gi;
	const classes = useStyles();
    const {pageNo} = useParams();
	const [ loading, setLoading ] = useState(true);
	const [ searchData, setSearchData ] = useState(undefined);
	const [ charactersData, setcharactersData ] = useState(undefined);
	const [ searchTerm, setSearchTerm ] = useState('');
    const [ error, setError ] = useState(true);
	let card = null;

    useEffect(() => {
		console.log('on load useeffect');
		async function fetchData() {
			let pagevalue = parseInt(pageNo);
			try{
                if(typeof pagevalue !=='number' || pagevalue < 0 || isNaN(pagevalue)){ 
                    setError(true);
                    setLoading(false);
                    return;
                }
			
            const LIMIT = 30;
            const offset = LIMIT * pagevalue;
			try {
				const { data } = await axios.get(url + "&limit=" + LIMIT + "&offset=" + offset);
				setcharactersData(data.data.results);
                setError(false);
				setLoading(false);
			} catch (e) {
				console.log(e);
			}
        }catch(e){
            console.log(e);
        }
		}
		fetchData();
	}, [pageNo]);


    useEffect(
		() => {
            let pagevalue = parseInt(pageNo);
            const LIMIT = 30;
            const offset = LIMIT * pagevalue;
			console.log('search useEffect fired');
			async function fetchData() {
				try {
					console.log(`in fetch searchTerm: ${searchTerm}`);
					const { data } = await axios.get( url + "&titleStartsWith=" + searchTerm  + "&limit=" + LIMIT + "&offset=" + offset);
					setSearchData(data.data.results);
					setLoading(false);
				} catch (e) {
					console.log(e);
				}
			}
			if (searchTerm) {
				console.log ('searchTerm is set')
				fetchData();
			}
		},
		[ searchTerm ]
	);

    const searchValue = async (value) => {
		setSearchTerm(value);
	};

    const buildCard = (show) => {
		return (
			<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={show.id}>
				<Card className={classes.card} variant='outlined'>
					<CardActionArea>
						<Link to={`/comics/${show.id}`}>
							<CardMedia
								className={classes.media}
								component='img'
								image={`${show.thumbnail.path}.${show.thumbnail.extension}`}
								title='show image'
							/>

                            <CardContent>
                                <Typography className={classes.titleHead} gutterBottom variant='h6' component='h2'>
                                    {show.name}
                                </Typography>
                                <Typography variant='body2' color='textSecondary' component='p'>
                                    {show.description ? show.description.replace(regex, '').substring(0, 139) + '...' : 'No Summary'}
                                    <span>More Info</span>
                                </Typography>
                            </CardContent>
                        </Link>
                    </CardActionArea>
				</Card>
			</Grid>
		);
	};

    if (searchTerm) {
		card =
			searchData &&
			searchData.map((shows) => {
				let show  = shows;
				return buildCard(show);
			});
	} else {
        card =
                charactersData &&
                charactersData.map((show) => {
                    return buildCard(show);
                });
    }

    if (loading) {
        return (
            <div>
                <h2>Loading....</h2>
            </div>
        );
    } else {
        if(error)
        {
            return ( <h2>404 This Page is Not Found</h2> )
        }
        else{
        return (
            <>
                <div>
                    <SearchShows searchValue={searchValue} />
                    <br />
                    <br /> 
                    <Grid container className={classes.grid} spacing={5}>
                        {card}
                    </Grid>
                    <div>
                        <br />
                        <br />
                        <br />
                        <br />
                        <Button>
                            <Link to = {`/comics/page/${parseInt(pageNo) - 1 < 0 ? 0 : parseInt(pageNo) - 1 }`} 
                                >
                                PREVIOUS
                            </Link>
                        </Button>
                        { pageNo }
                        <Button>
                            <Link to = {`/comics/page/${parseInt(pageNo) + 1 > 1719 ? 1719 : parseInt(pageNo) + 1}`}
                                >
                                Next
                            </Link>
                        </Button>
                        <br />
                        <br />
                    </div>
                </div>
            </>
        );
    }
}
};

export default CharactersList;

