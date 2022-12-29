<script>
    import { skills } from "../skills";


</script>


<div class="skills">

    {#each skills as {name, src} }
    
    <div class="skill-container">
        <div class="image">
            <img src="{src}" alt={name}>
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
        background-color: var(--color-principal);

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
@media (min-width: 320px) and (max-width: 480px) {

    .skills{
        margin-left: 0rem;
        margin-right: 0rem;
        padding-right: 1rem;
        padding-left: 1rem;
        justify-content: center;
        column-gap: 3rem;
    }
    .skill-container{
        height: 6rem;
        width: 3rem;
    }
    .name{
        font-size: 0.7rem;
    }
}

</style>