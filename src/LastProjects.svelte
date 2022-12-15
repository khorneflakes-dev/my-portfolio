<script>
    import Dash1 from "./Dash1.svelte";
    import Dash2 from "./Dash2.svelte";
    import Dash3 from "./Dash3.svelte";
</script>

<div class="projects">
    <div class="title">Mis ultimos proyectos</div>
    
    <Dash1/>

    <div class="separador"><hr></div>

    <Dash2/>

    <div class="separador"><hr></div>

    <Dash3/>

</div>

<style>
    .projects{
        margin-left: 35vw;
        margin-right: 18vw;
        margin-top: 2vh;
        margin-bottom: 10vh;
        font-family: 'Roboto', sans-serif;
        color: #303030;
        display: flex;
        flex-direction: column;
    }
    .title{
        margin-top: 2vh;
        margin-bottom: 6vh;
        font-size: 1.6rem;
        font-weight: 600;
    }
    hr{
        margin-top: 4vh;
        margin-bottom: 4vh;
    }

</style>