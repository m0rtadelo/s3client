export const HTML = `
<table style="width: 100%; height: 100%" cellspacing="0">
<tr style="height: 3em;">
  <td colspan="2"><main-menu></main-menu></td>
</tr>
<tr>
  <td style="width: 50%;">
    <file-explorer id="local"></file-explorer>
  </td>
  <td style="width: 50%; left: 50%; border-left: 1px solid #ccc;">
    <file-explorer id="remote"></file-explorer>
  </td>
  
</tr>
<tr style="height: 6em; position: absolute; bottom: 0px; left: 0px; right: 0px; display: grid;">
  <td colspan="2" style="overflow-y: auto; border-top: 1px solid #ccc; background-color: #333;"><tasks></tasks></td>
</tr>
</table>
`;
