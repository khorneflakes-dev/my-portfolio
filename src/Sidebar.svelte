<div class="sidebar">
    <div class="top-side">
        <div class="foto-perfil">
            <img src="./images/foto-perfil.png" alt="">
        </div>
        <div class="description">
            <div>Inicio</div>
            <div>Proyectos</div>
            <div>Perfil</div>
            <div>Sobre mi</div>
            <div>Contactame</div>
        </div>
    </div>
    <div class="bottom-side">
        <a href="https://github.com/khorneflakes-dev" target="_blank" rel="noopener noreferrer">
            <img src="./images/github.png" alt="github-logo">
        </a>
        <a href="https://www.linkedin.com/in/khorneflakes/" target="_blank" rel="noopener noreferrer">
            <img src="./images/linkedin.png" alt="linkedin-logo">
        </a>
        <a href="https://wa.me/59169839682" target="_blank" rel="noopener noreferrer">
            <img src="./images/whatsapp.png" alt="whatsapp-logo">
        </a>
        <a href="https://t.me/khorneflakesdev" target="_blank" rel="noopener noreferrer">
            <img src="./images/telegram.png" alt="telegram-logo">
        </a>
    </div>
</div>


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