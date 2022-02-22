import React, { useState, useEffect } from "react";
import alanBtn from "@alan-ai/alan-sdk-web";
import { Typography } from '@material-ui/core';
import NewsCards from "./components/NewsCards/NewsCards";
import classNames from "classnames";
import Logo from "./media/sinarahmannejad.com_logo.png";
import wordsToNumbers from 'words-to-numbers';

import useStyles from './styles.js'
const alanKey = process.env.REACT_APP_ALAN_API_KEY;

const App = () =>{
    const [newsArticles, setNewsArticles] = useState([]);
    const [activeArticle, setActiveArticle] = useState(-1); // the reason we set to -1 is that if it`s 0 then it will start reading from the second article
    const classes = useStyles();
useEffect(() => {
    alanBtn({
        key: alanKey,
        onCommand: ({command, articles, number}) => {
            if(command === 'newHeadlines'){
                setNewsArticles(articles);
                setActiveArticle(-1); // to reset when we want to read new news again
            } else if(command === 'highlight'){
                setActiveArticle((preActiveArticle) => preActiveArticle + 1);
            } else if(command === 'open'){
                const parsedNumber = number.length > 2 ? wordsToNumbers(number, { fuzzy: true }) : number;
                const article = articles[parsedNumber - 1];
                if(parsedNumber > 20){
                    alanBtn().playText('Please try that again.')
                } else if(article){
                    window.open(article.url, '_blank');
                    alanBtn().playText('Opening ...');
                }
                
            }
        }
    })
}, [])

    return(
        <div>
            <div className={classes.logoContainer}>
                <img src={Logo} className={classNames.alanLogo} alt="Logo" /> 
            </div>
            <NewsCards articles={newsArticles} activeArticle={activeArticle} />

            {!newsArticles.length ? (
        <div className={classes.footer}>
          <Typography variant="body1" component="h2">
            Created by
            <a className={classes.link} href="https://sinarahmannejad.com/" target="_blank"> Sina Rahmannejad</a>
          </Typography>
          <img className={classes.image} src={Logo} height="50px" alt="JSMastery logo" />
        </div>
      ) : null}
        </div>
    );
}

export default App;