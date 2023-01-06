<script>
    import { projects } from "../projects";
</script>

<div class="projects">
    <div class="title">My last projects</div>
    
    {#each projects as { title, preview, desc  }, i }
        {#if i<2}
            
        <div class="container">
            <img src={preview} alt={title}>
            <div class="description">
                <div class="desc-title">{title}</div>
                <div class="desc-extense">{desc}</div>
            </div>
        </div>
        <div class="separador"><hr></div>
        {/if}
    {/each}
  
</div>

<style>
    .projects{
        margin-left: 35vw;
        margin-right: 18vw;
        margin-top: 0vh;
        margin-bottom: 1vh;
        font-family: 'Roboto', sans-serif;
        color: var(--color-texto);
        display: flex;
        flex-direction: column;
    }
    .title{
        margin-top: 2vh;
        margin-bottom: 3vh;
        font-size: 1.6rem;
        font-weight: 600;
    }
    hr{
        margin-top: 4vh;
        margin-bottom: 4vh;
    }
    .container{
        display: flex;
        padding-left: 1vw;
        gap: 1vw;
        font-size: 1.2rem;
        align-items: center;
    }
    .container img{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 17rem;
        border-radius: 0.5rem;
        border: 1px solid var(--color-shadow);
    }

    .description{
        display: flex;
        flex-direction: column;
    }
    .desc-title{
        font-weight: 600;
        margin-bottom: 1vh;
    }
    .desc-extense{
        font-weight: 300;
    }
@media (min-width: 481px) and (max-width: 767px) {



}

/* 
##Device = Most of the Smartphones Mobiles (Portrait)
##Screen = B/w 320px to 479px
*/

@media (min-width: 320px) and (max-width: 480px) {
    .projects{
        margin-left: 2rem;
        margin-right: 2rem;
    }
    .container{
        flex-direction: column;
        padding-left: 0;
    }
    .container img{
        width: 100%;
    }
}
</style>