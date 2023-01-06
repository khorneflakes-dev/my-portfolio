<div class="portfolio-description">
    <div class="hola">Hey there 👋</div>
    <div class="title">
        <!-- <div class="light"></div> -->
        <div class="name">I'm Erick Mamani</div>
    </div>
    <div class="position">Data Analyst</div>
    <div class="description">
        I have experience in the commercial field.
        <br>
        I am passionate about programming and minimalist design, and I use these skills to create dashboards that are published as web applications.
        <br>
        My products are visually appealing and easy to use, designed to help users make decisions based on their data.
    </div>
</div>



<style>

    .portfolio-description{
        margin-left: 35vw;
        margin-right: 18vw;
        font-family: 'Roboto', sans-serif;
        color: var(--color-texto);
        padding-top: 8vh;
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
    .title .name{
        font-size: 2rem;
        font-weight: 700;
    }
    .position{
        font-size: 2rem;
        font-weight: 600;
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
    }
}

</style>