# Damage

## Weapons

| Mainhand | Offhand |
| --- | --- |
| <select id="Mainhand"></select> | <select id="Offhand"></select> |

## Skills

| Skill | Damage |
| --- | --- |
| <select id="1"></select> | |
| <select id="2"></select> | |
| <select id="3"></select> | |
| <select id="4"></select> | |
| <select id="5"></select> | |
| <select id="6"></select> | |
| <select id="7"></select> | |
| <select id="8"></select> | |
| <select id="9"></select> | |
| <select id="10"></select> | |
| <select id="11"></select> | |
| <select id="12"></select> | |


<script>
  fetch('./calculator/scripts/skills.js')
    .then(res => res.text())
    .then(code => {
      console.log('Loaded skills.js');
      eval(code); // 👈 executes the fetched JS
      fillSelect("Mainhand");
      fillSelect("Offhand");
    })
    .catch(console.error);
</script>