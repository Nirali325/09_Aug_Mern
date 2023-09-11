#include <stdio.h>
main() {
    int num[5],i,j;
    printf("Enter 5 numbers:\n");
    for (i = 1; i <= 5; i++) {
        printf("Enetr %d Number: ", i);
        scanf("%d", &num[i]);
    }
    for (i = 1; i <= 5; i++) {
        printf("\nTable of %d:\n", num[i]);
        for (j = 1; j <= 10; j++){
            printf("%d x %d = %d\n", num[i], j, num[i] * j);
        }
    }
}
