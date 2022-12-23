<script>
    import { skills } from "../skills";


</script>


<div class="skills">

    <div class="title">
        <!-- mis skills -->
    </div>
    {#each skills as {name, src} }
    
    <div class="skill-container">
        <div class="image">
            <img src="{src}" alt="">
        </div>
        <div class="name">{name}</div>
    </div>
        
    {/each}
</div>

<style>
    .skills{
        margin-left: 35vw;
        margin-right: 18vw;
        font-family: 'Roboto', sans-serif;
        color: var(--color-texto);
        padding-top: 7vh;
        display: flex;
        flex-wrap: wrap;
        column-gap: 1rem;
        row-gap: 1rem;
        font-family: var(--fuente-principal);
        margin-bottom: 10vh;
        
    }
    .title{
        width: 100%;
        display: flex;
        justify-content: center;
        font-size: 2rem;
        font-weight: 400;
        margin-bottom: 2vh;
    }
    .skill-container{
        display: flex;
        flex-direction: column;
        width: 10rem;
        height: 10rem;
        justify-content: center;
        border-radius: 1rem;
        filter: drop-shadow(-5px 5px 8px rgba(72, 72, 72, 0.253));

    }
    .image{
        width: 100%;
        display: flex;
        height: 80%;
        justify-content: center;
        align-items: center;
    }
    .skill-container img{
        height: 80%;
    }
    .name{
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-texto);
        font-size: 1.3rem;
        font-weight: 500;
        height: 20%;
        text-align: center;
    }
</style>