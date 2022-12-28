<div class="portfolio-description">
    <div class="hola">Hola 👋</div>
    <div class="title">
        <div class="light">soy</div>
        <div class="name">Erick Mamani</div>
    </div>
    <div class="position"><b>Analista</b> e <b>Ingeniero de Datos</b></div>
    <div class="description">
        Soy un analista de datos con formación en análisis e ingeniería de datos, con experiencia en el rubro comercial.
        <br>
        Me apasiona la programación y el diseño minimalista, utilizo estas habilidades para crear dashboards que se publican en forma de aplicaciones web.
        <br>
        Mis productos son visualmente atractivos y fáciles de usar, diseñados para ayudar a los usuarios a tomar decisiones basadas en sus datos
    </div>
</div>



<style>

    .portfolio-description{
        margin-left: 35vw;
        margin-right: 18vw;
        font-family: 'Roboto', sans-serif;
        color: var(--color-texto);
        padding-top: 10vh;
        display: flex;
        flex-direction: column;
        gap: 1vh;
    }
    .hola{
        font-size: 1.5rem;
        font-weight: 300;
    }
    .title{
        display: flex;
        align-items: center;
        gap: 0.5vw;
    }
    .title .light{
        font-size: 1.5rem;
        font-weight: 300;
        display: flex;
    }
    .title .name{
        font-size: 2rem;
        font-weight: 700;
    }
    .position{
        font-size: 2rem;
    }
    .description{
        font-size: 1.2rem;
        font-weight: 300;
        line-height: 1.5rem;
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
.portfolio-description{
    margin-left: 2rem;
    margin-right: 2rem;
    background-color: aqua;
    width: 100%;
}
}

</style>