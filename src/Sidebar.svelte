<script>
    import { Router, Link, Route } from "svelte-routing";
    import Home1 from "./Home1.svelte";
    import LastProjects from "./LastProjects.svelte";
    import Proyectos from "./pages/Proyectos.svelte";
    import Skills from "./pages/Skills.svelte";
    import Sobre_mi from "./pages/Sobre_mi.svelte";
    import Contactame from "./pages/Contactame.svelte";
    
</script>

<Router>

    <div class="sidebar">
        <div class="top-side">
            <div class="foto-perfil">
                <img src="./images/foto-perfil.png" alt="">
            </div>
            <div class="description">
                <div class="link"><Link to='/'>Inicio</Link></div>
                <div class="link"><Link to='/Sobre_mi'>Sobre mi</Link></div>
                <div class="link"><Link to='/Skills'>Skills</Link></div>
                <div class="link"><Link to='/Proyectos'>Proyectos</Link></div>
                <div class="link"><Link to='/Contactame'>Contactame</Link></div>
            </div>
        </div>
        <div class="bottom-side">
            <a href="https://github.com/khorneflakes-dev" target="_blank" rel="noopener noreferrer">
                <img src="./images/github.svg" alt="github-logo">
            </a>
            <a href="https://www.linkedin.com/in/khorneflakes/" target="_blank" rel="noopener noreferrer">
                <img src="./images/linkedin.svg" alt="linkedin-logo">
            </a>
            <a href="https://wa.me/59169839682" target="_blank" rel="noopener noreferrer">
                <img src="./images/whatsapp.svg" alt="whatsapp-logo">
            </a>
            <a href="https://t.me/khorneflakesdev" target="_blank" rel="noopener noreferrer">
                <img src="./images/telegram.svg" alt="telegram-logo">
            </a>
        </div>
    </div>

    <Route path='/'>
        <Home1/>
        <LastProjects/>

    </Route>
    
    <Route path='Proyectos'>
        <Proyectos></Proyectos>
    </Route>

    <Route path='Skills'>
        <Skills></Skills>
    </Route>

    <Route path='Sobremi'>
        <Sobre_mi></Sobre_mi>
    </Route>

    <Route path='Contactame'>
        <Contactame></Contactame>
    </Route>

</Router>



<style>

    .sidebar{
        display: flex;
        position: fixed;
        flex-direction: column;
        width: 16vw;
        height: 100vh;
        color: #303030;
        background-color: var(--color-secundario);
        justify-content: space-between;
    }
    .sidebar .foto-perfil{
        display: flex;
        width: 100%;
        align-items: center;
        flex-direction: column;
        margin-top: 10vh;
        
    }
    .foto-perfil img{
        width: 50%;
    }
    .description{
        display: flex;
        flex-direction: column;
        text-align: left;
        color: #303030;
        font-family: 'Roboto', sans-serif;
        font-size: 1.5rem;
        font-weight: 300;
        padding-left: 2vw;
        margin-top: 5vh;
        gap: 1.5vh;
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
    .link > :global(a) {
        text-decoration: none;
        color: var(--color-texto);
    }
    .link > :global(a:focus) {
        color: var(--color-texto);
        border-bottom: 1px solid var(--color-texto);
    }
    .link > :global(a:hover) {
        color: var(--color-texto);
        border-bottom: 1px solid var(--color-texto);
    }
    .link > :global(a:active) {
        color: var(--color-texto);
        border-bottom: 1px solid var(--color-texto);
    }

</style>