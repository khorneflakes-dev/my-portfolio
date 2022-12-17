<!-- <div>
    <a href="./pdfs/icao.pdf" target="_blank" rel="noopener noreferrer" >google</a>
</div>
<style>
    div{
        padding-left: 30vw;
    }
</style> -->
<script>
    import {projects} from '../projects'
    import {images} from '../images'
</script>
<div class="proyectos">

    {#each projects as { title, preview, desc , pdf , stack, url } }
        
        <div class="proyecto">
            <div class="preview">
                <img src="{preview}" alt="">
            </div>
            <div class="description">
                <div class="title">{title}</div>
                <div class="desc">{desc}</div>
                <div class="stack">
                    <div class="tecnologias">
                        <div class="stack-subtitle">stack:</div>
                        <div class="stack-container">
                            {#each images as {name, src} }
                            {#if stack.includes(name) }
                                <img src="{src}" alt="">
                            {/if}
                        {/each}
                        </div>
                    </div>

                    <div class="entregables">
                        <div class="version">version:</div>
                        <div class="static">
                            <a href={pdf} target="_blank" rel="noopener noreferrer" >estatica</a>
                        </div>
                        <div class="interactive">
                            <a href={url} target="_blank" rel="noopener noreferrer" >interactiva</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    {/each}

</div>

<style>
    .proyectos{
        margin-left: 25vw;
        margin-right: 18vw;
        font-family: 'Roboto', sans-serif;
        color: #303030;
        padding-top: 7vh;
        display: flex;
        flex-direction: column;
        column-gap: 1rem;
        row-gap: 1rem;
        font-family: var(--fuente-principal);
        margin-bottom: 10vh;
    }
    .proyecto{
        height: 14rem;
        width: 100%;
        border-radius: 20px;
        background-color: white;
        filter: drop-shadow(-5px 5px 28px rgba(0, 0, 0, 0.25));
        display: flex;
        
    }
    .preview{
        display: flex;
        justify-content: center;
        align-items: center;
        padding-left: 1vw;
    }
    .preview img{
        border-radius: 15px;
        height: 12rem;
        width: 20rem;
    }
    .stack{
        display: flex;
        justify-content: space-between;
    }
    .description{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding-left: 1rem;
        margin-top: 2rem;
        margin-bottom: 2rem;
        padding-right: 1rem;
    }
    .description .title{
        font-weight: 700;
    }
    .description .stack .stack-subtitle{
        font-weight: 600;
    }
    .stack{
        display: flex;
        height: 2rem;
        align-items: center;
    }
    .stack-container{
        display: flex;
        height: 100%;
        gap: 1rem;
        padding-left: 1rem;
        padding-right: 1rem;
    }
    .stack-container img{
        height: 100%;
    }
    .tecnologias{
        height: 100%;
        display: flex;
        align-items: center;
    }
    .entregables{
        height: 100%;
        display: flex;
        align-items: center;
        gap: 1rem;
        padding-right: 1rem;
    }
    .static, .interactive{
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--color-texto);
        border-radius: 0.4rem;
        height: 2.2rem;
        width: 7rem;
    }
    .version{
        font-weight: 600;
    }
    a{
        text-decoration: none;
        color: var(--color-principal);
    }

</style>