//        OUTPUT

//           4
//          43
//         432
//        4321



#include<iostream>
using namespace std;
int main()
{
    int n; cin>>n;
    for(int i=1;i<=n;i++)
    {
        int temp = n;
        for(int j=n;j>0;j--)
        {
            if(j>i) cout << " ";
            else
            {
                cout << temp ;
                temp--;
            }
        }
        cout << endl;
    }
}