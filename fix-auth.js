require('fs').writeFileSync(
  'app/api/auth/[...nextauth]/route.ts',
  'import { handlers } from "@/auth";\nexport const { GET, POST } = handlers;\n',
  'utf8'
);
console.log('done');
