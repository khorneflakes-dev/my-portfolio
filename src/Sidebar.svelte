<script>
    import { Router, Link, Route } from "svelte-routing";
    import Home1 from "./Home1.svelte";
    import LastProjects from "./LastProjects.svelte";
    import Proyectos from "./pages/Proyectos.svelte";
    import Perfil from "./pages/Perfil.svelte";
    import Sobremi from "./pages/Sobre mi.svelte";
    import Contactame from "./pages/Contactame.svelte";
    
</script>

<Router>

    <div class="sidebar">
        <div class="top-side">
            <div class="foto-perfil">
                <img src="./images/foto-perfil.png" alt="">
            </div>
            <div class="description">
                <Link to='/'>Inicio</Link>
                <Link to='/Proyectos'>Proyectos</Link>
                <Link to='/Perfil'>Perfil</Link>
                <Link to='/Sobre mi'>Sobre mi</Link>
                <Link to='/Contactame'>Contactame</Link>
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

    <Route path='Perfil'>
        <Perfil></Perfil>
    </Route>

    <Route path='Sobremi'>
        <Sobremi></Sobremi>
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
        background-color: #D9D9D9;
        justify-content: space-between;
        filter: opacity(30%);
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
    

</style>