<script>
    import { Router, Link, Route } from "svelte-routing";
    import Home1 from "./pages/Home1.svelte";
    import LastProjects from "./pages/LastProjects.svelte";
    import Proyectos from "./pages/Proyectos.svelte";
    import Skills from "./pages/Skills.svelte";
    import Sobre_mi from "./pages/Sobre_mi.svelte";
    import Contactame from "./pages/Contactame.svelte";
    import Footer from "./pages/Footer.svelte";

    let colorTheme = 'day'

    function theme() {
        if (colorTheme == 'day'){
            document.documentElement.style.setProperty('--color-texto', 'white')
            document.documentElement.style.setProperty('--color-principal', '#303030')
            document.documentElement.style.setProperty('--color-secundario', '#343434')
            document.documentElement.style.setProperty('--color-shadow', '#ffffff86')
            document.documentElement.style.setProperty('--line-color', '#ffa705')
            colorTheme = 'night'
        }
        else if (colorTheme == 'night'){
            document.documentElement.style.setProperty('--color-texto', '#303030')
            document.documentElement.style.setProperty('--color-principal', 'white')
            document.documentElement.style.setProperty('--color-secundario', '#d9d9d9')
            document.documentElement.style.setProperty('--color-shadow', '#3a3a3a41')
            document.documentElement.style.setProperty('--line-color', '#5425d6')
            colorTheme = 'day'
        }
    }

    let translatex = 0
    function burger() {
        const div = document.getElementById('sidebar');
        if (translatex == 100){
            div.style.transform = 'translateX(-100%)';
            translatex = 0
        }
        else if (translatex == 0){
            div.style.transform = 'translateX(0%)';
            translatex = 100
        }

        requestAnimationFrame(animarDiv);
    }

</script>

<Router>

    <div class="sidebar" id="sidebar">
        <div class="top-side">
            <div class="foto-perfil">
                <img src="./images/foto-perfil.png" alt="">
                <!-- <div class="border"></div> -->
            </div>
            <div class="description">
                <div class="link"><Link to='/'><p>Inicio</p></Link></div>
                <div class="link"><Link to='/Sobre_mi'><p>Sobre mi</p></Link></div>
                <div class="link"><Link to='/Skills'><p>Skills</p></Link></div>
                <div class="link"><Link to='/Proyectos'><p>Proyectos</p></Link></div>
                <div class="link"><p>Contactame</p></div>
            </div>
        </div>
        <div class="bottom-side">
            <a href="https://github.com/khorneflakes-dev" target="_blank" rel="noopener noreferrer">
                <img src="./images/github-{colorTheme}.svg" alt="github-logo">
            </a>
            <a href="https://www.linkedin.com/in/khorneflakes/" target="_blank" rel="noopener noreferrer">
                <img src="./images/linkedin-{colorTheme}.svg" alt="linkedin-logo">
            </a>
            <a href="https://wa.me/59169839682" target="_blank" rel="noopener noreferrer">
                <img src="./images/whatsapp-{colorTheme}.svg" alt="whatsapp-logo">
            </a>
            <a href="https://t.me/khorneflakesdev" target="_blank" rel="noopener noreferrer">
                <img src="./images/telegram-{colorTheme}.svg" alt="telegram-logo">
            </a>
        </div>
    </div>
    <div class="navbar">
        <img src="favicon.png" alt="logo" class="navbar-logo">
    </div>
    <div class="theme">
        <button on:click={theme} class="button-theme">
            <img src="./images/theme/{colorTheme}.svg" alt="">
        </button>
    </div>
    <div class="slider-button">
        <button on:click={burger} class='burger-button'>
            <img src="./images/burger{colorTheme}.svg" alt="">
        </button>
    </div>
    
    <Route path='/'>
        <Home1/>
        <LastProjects/>
    </Route>
    
    <Route path='/Proyectos'>
        <Proyectos/>
    </Route>

    <Route path='/Skills'>
        <Skills/>
    </Route>

    <Route path='/Sobre_mi'>
        <Sobre_mi/>
    </Route>

    <Route path='/Contactame'>
        <Contactame/>
    </Route>
    <Footer/>
    
</Router>



<style>

    .sidebar{
        display: flex;
        position: fixed;
        flex-direction: column;
        width: 18.5rem;
        height: 100vh;
        color: #303030;
        background-color: var(--color-secundario);
        justify-content: space-between;
    }
    .theme{
        display: flex;
        position: fixed;
        z-index: 20;
        justify-content: center;
        align-items: center;
        right: 2rem;
        top: 2rem;
        height: 4rem;
        width: 4rem;
    }
    .button-theme{
        background-color: transparent;
        border: none;
        cursor: pointer;
        display: flex;
        height: 100%;
        width: 100%;
    }
    .button-theme img{
        width: 100%;
    }

    .sidebar .foto-perfil{
        display: flex;
        width: 100%;
        align-items: center;
        flex-direction: column;
        margin-top: 10vh;
        border-radius: 20rem;
        position: relative;
        height: 10rem;
        justify-content: center;
    }
    /* .border{
        position: absolute;
        width: 10rem;
        height: 10rem;
        background-color: #303030;
        border-radius: 20rem;
    } */
    .foto-perfil img{
        width: 50%;
        transform: rotate(0deg);
        position: absolute;
        z-index: 10;
        /* animation: myfirst 1.5s infinite linear;
        animation: demoanimation 20s infinite linear; */
    }
    .description{
        display: flex;
        flex-direction: column;
        text-align: left;
        color: var(--color-texto);
        font-family: 'Roboto', sans-serif;
        font-size: 1.5rem;
        font-weight: 300;
        padding-left: 2vw;
        margin-top: 5vh;
        gap: 0.5vh;
        text-decoration: dashed;
    }

    .bottom-side{
        display: flex;
        justify-content: center;
        gap: 1vw;
        margin-bottom: 10vh;
    }
    .bottom-side img{
        height: 4vh;
    }
    .link{
        /* background-color: aquamarine; */
        width: 12rem;
        height: 2.4rem;
        display: flex;
        justify-content: left;
        align-items: center;
    }
    
    .link >:global(a){
        color: var(--color-texto);
        text-decoration: none;
    }
    .link p{
        height: 2.4rem;
        display: flex;
        align-items: center;
        width: 12rem;
        padding-left: 1rem;
        border-radius: 0.4rem;
    }
    .link p:hover {
        background-color: var(--color-box);
    }
    .link p:active {
        background-color: var(--color-texto);
        color: var(--color-principal);
        font-weight: 400;
    }
    .navbar{
        display: none;
    }

 /* 
	##Device = Low Resolution Tablets, Mobiles (Landscape)
	##Screen = B/w 481px to 767px
  */
  
@media (min-width: 481px) and (max-width: 767px) {



}

/* 
##Device = Most of the Smartphones Mobiles (Portrait)
##Screen = B/w 320px to 479px
*/

@media (min-width: 320px) and (max-width: 480px) {

    .navbar{
        display: flex;
        height: 3.5rem;
        background-color: var(--color-secundario);
        z-index: 18;
        position: fixed;
        width: 100%;
        justify-content: center;
        align-items: center;
    }
    .navbar img{
        height: 80%;
    }
    .sidebar{
        /* display: none; */
        /* transform: translateX(-5rem); */
        transition: 0.3s;
        width: 70%;
        transform: translateX(-100%);
        z-index: 17;
    }
    .slider-button{
        display: flex;
        position: fixed;
        z-index: 19;
        justify-content: center;
        align-items: center;
        top: 1rem;
        left: 1rem;
        height: 2.5rem;
        width: 2.5rem;
    }
    .burger-button{
        background-color: transparent;
        border: none;
        cursor: pointer;
        display: flex;
        height: 100%;
        width: 100%;
    }
    .burger-button img{
        width: 100%;
    }
    .theme{
        height: 2.5rem;
        width: 2.5rem;
        top: 1rem;
        right: 1rem;
    }

}

</style>